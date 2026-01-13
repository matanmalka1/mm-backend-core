import rateLimit from "express-rate-limit";
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
