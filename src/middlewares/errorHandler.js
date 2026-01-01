import { ApiError, API_ERROR_CODES } from '../constants/api-error-codes.js';
import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(
      API_ERROR_CODES.SERVER_ERROR,
      message,
      statusCode,
      err.stack
    );
  }

  const { code, message, statusCode, details } = error;

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
