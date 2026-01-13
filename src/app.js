import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import passport from "passport";

import "./models/Permission.js";
import "./models/RefreshToken.js";
import "./models/Role.js";
import "./models/User.js";

import {
  configureGoogleStrategy,
  configureGitHubStrategy,
  configureFacebookStrategy,
} from "./config/oauth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { router } from "./routes/index.js";

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

const bodyLimit = process.env.BODY_LIMIT || "1mb";
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
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
