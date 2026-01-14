import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { z } from "zod";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env"
    : `.env.${process.env.NODE_ENV || "development"}`;

const preferredDevEnv = path.join(process.cwd(), ".env.development");
const envPath = path.join(process.cwd(), envFile);

if (!process.env.NODE_ENV && fs.existsSync(preferredDevEnv)) {
  dotenv.config({ path: preferredDevEnv });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const refreshDurationSchema = z
  .string()
  .regex(
    /^\d+(ms|s|m|h|d)$/i,
    "JWT_REFRESH_EXPIRES_IN must be a duration like 15m or 7d"
  );

const envSchema = z
  .object({
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
    JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
    JWT_ACCESS_EXPIRES_IN: z
      .string()
      .min(1, "JWT_ACCESS_EXPIRES_IN is required"),
    JWT_REFRESH_EXPIRES_IN: refreshDurationSchema,
  })
  .loose();

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => issue.message)
    .join(", ");
  throw new Error(`Invalid environment configuration: ${details}`);
}
