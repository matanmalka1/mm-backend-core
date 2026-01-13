import { getRefreshTokenTtlMs } from "./duration.js";

export const buildCookieOptions = (overrides = {}) => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  maxAge: getRefreshTokenTtlMs(),
  path: "/",
  ...overrides,
});
