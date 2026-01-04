import dotenv from "dotenv";
import fs from "fs";
import path from "path";

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
