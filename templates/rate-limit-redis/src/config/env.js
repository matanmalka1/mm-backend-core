import dotenv from "dotenv";

dotenv.config();

const required = ["REDIS_URL", "RATE_LIMIT_WINDOW_MS", "RATE_LIMIT_MAX"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  REDIS_URL: process.env.REDIS_URL,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX),
};
