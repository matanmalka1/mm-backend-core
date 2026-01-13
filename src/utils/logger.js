import { existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import winston from "winston";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REDACT_KEYS = new Set([
  "password",
  "currentPassword",
  "newPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "set-cookie",
  "secret",
  "apiKey",
  "apikey",
]);

const redactValue = (value, seen) => {
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return value;
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, seen));
  }

  return Object.keys(value).reduce((acc, key) => {
    const normalizedKey = key.toLowerCase();
    if (REDACT_KEYS.has(key) || REDACT_KEYS.has(normalizedKey)) {
      acc[key] = "[REDACTED]";
    } else {
      acc[key] = redactValue(value[key], seen);
    }
    return acc;
  }, {});
};

const redactFormat = winston.format((info) => {
  const seen = new WeakSet();
  const redacted = redactValue(info, seen);
  return redacted;
});

// Ensure logs directory exists
const logsDir = path.join(path.dirname(__dirname), "..", "logs");
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

// Custom format for file output
const fileFormat = winston.format.combine(
  redactFormat(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Custom format for console output
const consoleFormat = winston.format.combine(
  redactFormat(),
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // Format console log lines with timestamp and metadata.
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}]: ${message}${extra}`;
  })
);

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: fileFormat,
  handleExceptions: true,
  handleRejections: true,
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 2,
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 2,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

export const stream = {
  // Forward Morgan messages into winston.
  write: (message) => logger.info(message.trim()),
};
