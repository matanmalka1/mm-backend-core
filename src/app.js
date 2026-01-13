import express from "express";
import "express-async-errors";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import passport from "passport";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { router } from "./routes/index.js";
import {
  configureGoogleStrategy,
  configureGitHubStrategy,
  configureFacebookStrategy,
} from "./config/oauth.js";

export const app = express();

app.use(helmet());

const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : undefined,
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(mongoSanitize());

configureGoogleStrategy();
configureGitHubStrategy();
configureFacebookStrategy();
app.use(passport.initialize());

app.use(requestLogger);

app.use(globalRateLimiter);

app.use(`/api/v1`, router);

app.use(notFound);
app.use(errorHandler);
