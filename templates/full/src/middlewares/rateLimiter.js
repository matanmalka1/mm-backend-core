import rateLimit, { ipKeyGenerator } from "express-rate-limit";

import { API_ERROR_CODES } from "../constants/api-error-codes.js";

// Apply global rate limits for all requests.
export const globalRateLimiter = rateLimit({
  windowMs: +process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: +process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply stricter rate limits for auth endpoints.
export const authRateLimiter = rateLimit({
  windowMs: +process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: +process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || 10,
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: "Too many authentication attempts, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Apply rate limits for refresh token exchanges.
export const refreshRateLimiter = rateLimit({
  windowMs: +process.env.REFRESH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: +process.env.REFRESH_RATE_LIMIT_MAX_REQUESTS || 10,
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: "Too many refresh attempts, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply dedicated rate limits for password change attempts.
export const passwordChangeRateLimiter = rateLimit({
  windowMs: +process.env.PASSWORD_CHANGE_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: +process.env.PASSWORD_CHANGE_RATE_LIMIT_MAX_REQUESTS || 5,
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: "Too many password change attempts, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limits for OAuth start/callback endpoints.
export const oauthRateLimiter = rateLimit({
  windowMs: +process.env.OAUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: +process.env.OAUTH_RATE_LIMIT_MAX_REQUESTS || 20,
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: "Too many OAuth attempts, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limits for password reset requests (per email when available).
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: +process.env.FORGOT_PASSWORD_RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000,
  max: +process.env.FORGOT_PASSWORD_RATE_LIMIT_MAX_REQUESTS || 3,
  keyGenerator: (req) => {
    const email = req.body?.email;
    return email ? String(email).trim().toLowerCase() : ipKeyGenerator(req);
  },
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: "Too many password reset requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
