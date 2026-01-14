import passport from "passport";

import { User } from "../../models/User.js";
import { logger } from "../../utils/logger.js";
import { hashPassword } from "../../utils/password.js";
import { ensureDefaultUserRole } from "../../utils/role-utils.js";

const normalizeUrl = (value) => value.replace(/\/+$/, "");

const buildApiBaseUrl = () => {
  const apiPrefix = process.env.API_PREFIX || "/api/v1";
  const normalizedPrefix = apiPrefix.startsWith("/") ? apiPrefix : `/${apiPrefix}`;

  if (!process.env.API_URL) {
    return `http://localhost:3000${normalizedPrefix}`;
  }

  const normalizedApiUrl = normalizeUrl(process.env.API_URL);
  if (normalizedApiUrl.endsWith(normalizedPrefix)) {
    return normalizedApiUrl;
  }

  return `${normalizedApiUrl}${normalizedPrefix}`;
};

const oauthCallbackUrl = (providerKey) =>
  `${buildApiBaseUrl()}/auth/${providerKey}/callback`;

const getDisplayName = (profile) => {
  if (profile?.displayName) return profile.displayName;
  const combinedName = [profile?.name?.givenName, profile?.name?.familyName].filter(Boolean).join(" ");
  return combinedName || profile?.username || "User";
};

const getEmailFromProfile = (profile) => {
  const emailEntry = profile?.emails?.[0];
  const isVerified = emailEntry?.verified;
  if (isVerified === false) return null;
  return emailEntry?.value || profile?.email || null;
};

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

    const email = getEmailFromProfile(profile);
    if (email) {
      user = await User.findOne({ email });
    }

    if (user) {
      if (!user.oauth) user.oauth = {};
      user.oauth[provider] = {
        id: profile.id,
        displayName: getDisplayName(profile),
      };
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    const role = await ensureDefaultUserRole();

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
          displayName: getDisplayName(profile),
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
