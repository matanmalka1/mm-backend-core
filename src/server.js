import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import app from "./app.js";
import { testConnection } from "./config/db.js";

const envFile =
  process.env.NODE_ENV && process.env.NODE_ENV !== "production"
    ? `.env.${process.env.NODE_ENV}`
    : ".env";

const cwd = process.cwd();
const preferredDevEnv = path.join(cwd, ".env.development");
const envPath = path.join(cwd, envFile);

if (!process.env.NODE_ENV && fs.existsSync(preferredDevEnv)) {
  dotenv.config({ path: preferredDevEnv });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const startServer = async () => {
  await testConnection();

  const port = +process.env.PORT || 3000;
  app.listen(port, () => {console.log(`Listening on ${port}`)});
};

startServer().catch(() => {
  console.error(err);
  process.exit(1);
});
