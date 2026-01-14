import dotenv from "dotenv";

dotenv.config();

const required = ["MAX_FILE_SIZE", "ALLOWED_MIME"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE),
  ALLOWED_MIME: process.env.ALLOWED_MIME,
};
