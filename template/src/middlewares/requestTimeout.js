import { API_ERROR_CODES } from "../constants/api-error-codes.js";
import { errorResponse } from "../utils/response.js";

export const requestTimeout = (req, res, next) => {
  const timeoutMs = +process.env.REQUEST_TIMEOUT_MS || 30 * 1000;
  const timer = setTimeout(() => {
    if (res.headersSent) return;
    errorResponse(
      res,
      API_ERROR_CODES.REQUEST_TIMEOUT,
      "Request timed out",
      503
    );
  }, timeoutMs);

  res.on("finish", () => clearTimeout(timer));
  res.on("close", () => clearTimeout(timer));

  next();
};
