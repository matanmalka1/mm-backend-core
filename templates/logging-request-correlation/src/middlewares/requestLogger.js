import { logger } from "../utils/logger.js";
import crypto from "crypto";

export const requestLogger = (req, res, next) => {
  const id = crypto.randomUUID();
  req.requestId = id;
  logger.info("request:start", { id, method: req.method, path: req.path });
  res.on("finish", () => {
    logger.info("request:end", { id, status: res.statusCode });
  });
  next();
};
