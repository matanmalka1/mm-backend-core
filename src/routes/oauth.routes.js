import crypto from "node:crypto";

import express from "express";
import passport from "passport";

import { oauthRateLimiter } from "../middlewares/rateLimiter.js";
import { handleOAuthLogin } from "../services/auth/core.service.js";
import { buildCookieOptions } from "../utils/cookie-options.js";
import { logger } from "../utils/logger.js";

export const router = express.Router();

router.use(oauthRateLimiter);

const OAUTH_STATE_COOKIE = "oauthState";
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

const getFrontendBase = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";

const oauthStateCookieOptions = buildCookieOptions({
  maxAge: OAUTH_STATE_TTL_MS,
});

const setOAuthStateCookie = (res, state) => {
  res.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions);
};

const clearOAuthStateCookie = (res) => {
  res.clearCookie(OAUTH_STATE_COOKIE, oauthStateCookieOptions);
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
    logger.warn("OAuth state validation failed", { provider: providerLabel });
    return res.redirect(`${getFrontendBase()}/login?error=invalid_state`);
  }

  return next();
};

const handleOAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      logger.warn("OAuth callback: User not found");
      return res.redirect(
        `${getFrontendBase()}/login?error=auth_failed`
      );
    }

    const { accessToken, refreshToken } = await handleOAuthLogin(user);

    res.cookie("refreshToken", refreshToken, buildCookieOptions());

    const redirectUrl = `${getFrontendBase()}/auth/callback#accessToken=${encodeURIComponent(
      accessToken
    )}&userId=${encodeURIComponent(user._id.toString())}`;

    res.redirect(redirectUrl);
  } catch (error) {
    logger.error("OAuth callback error:", error.message);
    res.redirect(
      `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/login?error=server_error`
    );
  }
};

router.get(
  "/google",
  startOAuth("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  validateOAuthState("google"),
  passport.authenticate("google", { session: false }),
  handleOAuthCallback
);

router.get(
  "/github",
  startOAuth("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  validateOAuthState("github"),
  passport.authenticate("github", { session: false }),
  handleOAuthCallback
);

router.get(
  "/facebook",
  startOAuth("facebook", { scope: ["email", "public_profile"] })
);

router.get(
  "/facebook/callback",
  validateOAuthState("facebook"),
  passport.authenticate("facebook", { session: false }),
  handleOAuthCallback
);
