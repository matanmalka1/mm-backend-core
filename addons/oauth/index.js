import crypto from "node:crypto";

import express from "express";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubOAuth2Strategy } from "passport-github2";
import { Strategy as GoogleOAuth2Strategy } from "passport-google-oauth20";

const DEFAULT_API_BASE_URL = "http://localhost:3000";
const DEFAULT_FRONTEND_URL = "http://localhost:5173";
const OAUTH_STATE_COOKIE = "oauthState";
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

const defaultBuildCallbackUrl = (providerKey) =>
  `${process.env.API_BASE_URL || DEFAULT_API_BASE_URL}/api/v1/auth/${providerKey}/callback`;

const defaultFindOrCreateUser = async (profile) => ({
  id: profile.id,
  displayName: profile.displayName || profile.username || "User",
  provider: profile.provider,
});

const configureOAuthStrategy = ({
  Strategy,
  providerKey,
  providerLabel,
  clientIdEnv,
  clientSecretEnv,
  strategyOptions = {},
  findOrCreateUser = defaultFindOrCreateUser,
  buildCallbackUrl = defaultBuildCallbackUrl,
} = {}) => {
  const clientId = process.env[clientIdEnv];
  const clientSecret = process.env[clientSecretEnv];

  if (!clientId || !clientSecret) {
    console.warn(`${providerLabel} OAuth disabled: missing ${clientIdEnv} or ${clientSecretEnv}`);
    return;
  }

  passport.use(
    providerKey,
    new Strategy(
      {
        clientID: clientId,
        clientSecret,
        callbackURL: buildCallbackUrl(providerKey),
        ...strategyOptions,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, providerKey);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

export const configureOAuth = ({ findOrCreateUser, buildCallbackUrl } = {}) => {
  const options = { findOrCreateUser, buildCallbackUrl };

  configureOAuthStrategy({
    providerLabel: "Google",
    providerKey: "google",
    Strategy: GoogleOAuth2Strategy,
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    ...options,
  });

  configureOAuthStrategy({
    providerLabel: "GitHub",
    providerKey: "github",
    Strategy: GitHubOAuth2Strategy,
    clientIdEnv: "GITHUB_CLIENT_ID",
    clientSecretEnv: "GITHUB_CLIENT_SECRET",
    ...options,
  });

  configureOAuthStrategy({
    providerLabel: "Facebook",
    providerKey: "facebook",
    Strategy: FacebookStrategy,
    clientIdEnv: "FACEBOOK_CLIENT_ID",
    clientSecretEnv: "FACEBOOK_CLIENT_SECRET",
    strategyOptions: {
      profileFields: ["id", "displayName", "emails"],
    },
    ...options,
  });

  return passport;
};

const getFrontendBase = () => process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;

const buildCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: OAUTH_STATE_TTL_MS,
});

const setOAuthStateCookie = (res, state) => {
  res.cookie(OAUTH_STATE_COOKIE, state, buildCookieOptions());
};

const clearOAuthStateCookie = (res) => {
  res.clearCookie(OAUTH_STATE_COOKIE, buildCookieOptions());
};

const buildState = () => crypto.randomBytes(32).toString("hex");

const startOAuth = (provider, options) => (req, res, next) => {
  const state = buildState();
  setOAuthStateCookie(res, state);
  return passport.authenticate(provider, { ...options, state })(req, res, next);
};

const validateOAuthState = (providerLabel) => (req, res, next) => {
  const state = req.query.state;
  const cookieState = req.cookies?.[OAUTH_STATE_COOKIE];
  clearOAuthStateCookie(res);

  if (!state || !cookieState || state !== cookieState) {
    return res.redirect(`${getFrontendBase()}/login?error=invalid_state`);
  }

  return next();
};

const handleOAuthCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect(`${getFrontendBase()}/login?error=auth_failed`);
  }

  // Replace this with your session/token logic.
  return res.redirect(`${getFrontendBase()}/login?oauth=success`);
};

export const oauthRouter = express.Router();

oauthRouter.get(
  "/google",
  startOAuth("google", { scope: ["profile", "email"] })
);

oauthRouter.get(
  "/google/callback",
  validateOAuthState("google"),
  passport.authenticate("google", { session: false }),
  handleOAuthCallback
);

oauthRouter.get(
  "/github",
  startOAuth("github", { scope: ["user:email"] })
);

oauthRouter.get(
  "/github/callback",
  validateOAuthState("github"),
  passport.authenticate("github", { session: false }),
  handleOAuthCallback
);

oauthRouter.get(
  "/facebook",
  startOAuth("facebook", { scope: ["email", "public_profile"] })
);

oauthRouter.get(
  "/facebook/callback",
  validateOAuthState("facebook"),
  passport.authenticate("facebook", { session: false }),
  handleOAuthCallback
);
