import dotenv from "dotenv";

dotenv.config();

const required = ["CORS_ORIGIN"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};
