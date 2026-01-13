import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
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
import { correlationId } from "./middlewares/correlationId.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { requestSanitizer } from "./middlewares/requestSanitizer.js";
import { requestTimeout } from "./middlewares/requestTimeout.js";
import { router } from "./routes/index.js";
import { logger } from "./utils/logger.js";

export const app = express();

app.use(correlationId);
app.use(helmet());

const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const hasCorsOrigins = corsOrigins.length > 0;

if (!hasCorsOrigins) {
  logger.warn("CORS origins not configured; disabling credentials-based CORS");
}

app.use(
  cors({
    origin: hasCorsOrigins ? corsOrigins : false,
    credentials: hasCorsOrigins,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(requestSanitizer);

configureGoogleStrategy();
configureGitHubStrategy();
configureFacebookStrategy();
app.use(passport.initialize());
app.use(requestLogger);

app.use(globalRateLimiter);
app.use(requestTimeout);

app.use(`/api/v1`, router);

app.use(notFound);
app.use(errorHandler);
