import { ApiError, serverError } from '../utils/error-factories.js';
import { errorResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Normalize errors and send a consistent JSON response.
export const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = serverError(message);
    error.statusCode = statusCode;
    if (err instanceof Error) {
      error.details = err.stack;
    }
  }

  const { code, message, statusCode, details } = error;
  const stack = error.stack || (err instanceof Error ? err.stack : undefined);
  const userId = req.user ? (req.user.id || req.user._id) : undefined;

  // Log the error
  const logMessage = {
    code,
    message,
    statusCode,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId,
  };

  if (statusCode >= 500) {
    logger.error('Server Error', { ...logMessage, stack });
  } else if (statusCode >= 400) {
    logger.warn('Client Error', logMessage);
  }

  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
  }

  return errorResponse(
    res,
    code,
    message,
    statusCode,
    process.env.NODE_ENV !== 'production' ? details : null
  );
};
