import passport from "passport";
import { Strategy as GoogleOAuth2Strategy } from "passport-google-oauth20";
import { Strategy as GitHubOAuth2Strategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User, Role } from "../models/index.js";
import { hashPassword } from "../utils/password.js";
import { logger } from "../utils/logger.js";

const findOrCreateUser = async (profile, provider) => {
  try {
    const oauthField = `oauth.${provider}.id`;
    let user = await User.findOne({ [oauthField]: profile.id });

    if (user) {
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    const email = profile.emails?.[0]?.value || profile.email;
    user = await User.findOne({ email });

    if (user) {
      if (!user.oauth) user.oauth = {};
      user.oauth[provider] = {
        id: profile.id,
        displayName: profile.displayName || profile.name,
      };
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    const role = await Role.findOne({ name: "user" });
    if (!role) throw new Error("Default USER role not found. Run database seed.");

    const firstName =
      profile.name?.givenName || profile.displayName?.split(" ")?.[0] || "User";
    const lastName =
      profile.name?.familyName || profile.displayName?.split(" ")?.[1] || "User";
    const newEmail = email || `${provider}-${profile.id}@oauth.local`;

    const hashedPassword = await hashPassword(`oauth-${provider}-${profile.id}`);
    const newUser = await User.create({
      email: newEmail,
      firstName,
      lastName,
      password: hashedPassword,
      role: role._id,
      oauth: {
        [provider]: {
          id: profile.id,
          displayName: profile.displayName || profile.name,
        },
      },
      lastLogin: new Date(),
      isActive: true,
    });

    logger.info(`New user created via ${provider} OAuth: ${newUser.email}`);
    return newUser;
  } catch (error) {
    logger.error(`Error in findOrCreateUser (${provider}):`, error.message);
    throw error;
  }
};

const configureOAuthStrategy = (
  provider,
  Strategy,
  clientIdEnv,
  clientSecretEnv
) => {
  const clientID = process.env[clientIdEnv];
  const clientSecret = process.env[clientSecretEnv];

  if (!clientID || !clientSecret) {
    logger.warn(
      `${provider} OAuth: ${clientIdEnv} or ${clientSecretEnv} not set. ${provider} login disabled.`
    );
    return;
  }

  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: `${
          process.env.API_URL || "http://localhost:3000/api/v1"
        }/auth/${provider.toLowerCase()}/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, provider.toLowerCase());
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  logger.info(`${provider} OAuth strategy configured`);
};

export const configureGoogleStrategy = () => {
  configureOAuthStrategy(
    "Google",
    GoogleOAuth2Strategy,
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET"
  );
};

export const configureGitHubStrategy = () => {
  configureOAuthStrategy(
    "GitHub",
    GitHubOAuth2Strategy,
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET"
  );
};

export const configureFacebookStrategy = () => {
  const clientID = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    logger.warn(
      "Facebook OAuth: FACEBOOK_CLIENT_ID or FACEBOOK_CLIENT_SECRET not set. Facebook login disabled."
    );
    return;
  }

  passport.use(
    new FacebookStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `${
          process.env.API_URL || "http://localhost:3000/api/v1"
        }/auth/facebook/callback`,
        profileFields: ["id", "displayName", "name", "emails", "photos"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, "facebook");
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  logger.info("Facebook OAuth strategy configured");
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
