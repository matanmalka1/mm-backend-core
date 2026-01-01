import rateLimit from "express-rate-limit";
import { API_ERROR_CODES } from "../constants/api-error-codes.js";

export const globalRateLimiter = rateLimit({
  windowMs: +process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: +process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.SERVER_ERROR,
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: +process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: +process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || 10,
  message: {
    success: false,
    error: {
      code: API_ERROR_CODES.SERVER_ERROR,
      message: "Too many authentication attempts, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
