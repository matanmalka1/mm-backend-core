import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
});
