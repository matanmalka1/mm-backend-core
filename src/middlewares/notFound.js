import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";

export const notFound = (req, _res, next) => {
  const error = new ApiError(API_ERROR_CODES.RESOURCE_NOT_FOUND,`Route ${req.originalUrl} not found`,404);
  next(error);
};
