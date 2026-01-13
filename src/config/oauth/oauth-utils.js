import passport from "passport";

import { Role } from "../../models/Role.js";
import { User } from "../../models/User.js";
import { logger } from "../../utils/logger.js";
import { hashPassword } from "../../utils/password.js";

const oauthCallbackUrl = (providerKey) =>
  `${process.env.API_URL || "http://localhost:3000/api/v1"}/auth/${providerKey}/callback`;

const oauthVerify = (providerKey) => async (_accessToken, _refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, providerKey);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

export const findOrCreateUser = async (profile, provider) => {
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
    if (!role) {
      throw new Error("Default USER role not found. Run database seed.");
    }

    const firstName =
      profile.name?.givenName || profile.displayName?.split(" ")?.[0] || "User";
    const lastName =
      profile.name?.familyName ||
      profile.displayName?.split(" ")?.[1] ||
      "User";
    const newEmail = email || `${provider}-${profile.id}@oauth.local`;

    const hashedPassword = await hashPassword(
      `oauth-${provider}-${profile.id}`
    );
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

export const configureOAuthStrategy = ({
  providerLabel,
  providerKey,
  Strategy,
  clientIdEnv,
  clientSecretEnv,
  strategyOptions = {},
}) => {
  const clientID = process.env[clientIdEnv];
  const clientSecret = process.env[clientSecretEnv];

  if (!clientID || !clientSecret) {
    logger.warn(
      `${providerLabel} OAuth: ${clientIdEnv} or ${clientSecretEnv} not set. ${providerLabel} login disabled.`
    );
    return;
  }

  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: oauthCallbackUrl(providerKey),
        ...strategyOptions,
      },
      oauthVerify(providerKey)
    )
  );
  logger.info(`${providerLabel} OAuth strategy configured`);
};
