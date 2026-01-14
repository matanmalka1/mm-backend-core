import { notFoundError } from "../utils/error-factories.js";

// Handle unknown routes with a 404 ApiError.
export const notFound = (req, _res, next) => {
  next(notFoundError(`Route ${req.originalUrl} not found`));
};
