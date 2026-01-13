import express from "express";
import passport from "passport";

import { handleOAuthLogin } from "../services/auth/core.service.js";
import { logger } from "../utils/logger.js";

export const router = express.Router();

const handleOAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      logger.warn("OAuth callback: User not found");
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=auth_failed`
      );
    }

    const { accessToken, refreshToken } = await handleOAuthLogin(user);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE
        ? process.env.COOKIE_SECURE === "true"
        : isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = `${frontendBase}/auth/callback#accessToken=${encodeURIComponent(
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
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleOAuthCallback
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  handleOAuthCallback
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  handleOAuthCallback
);
