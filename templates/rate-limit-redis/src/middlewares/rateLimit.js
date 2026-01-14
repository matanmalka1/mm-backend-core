import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import { env } from "../config/env.js";

const client = createClient({ url: env.REDIS_URL });
client.connect().catch((err) => {
  console.error("Redis connection error", err);
});

export const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand: (...args) => client.sendCommand(args) }),
});
