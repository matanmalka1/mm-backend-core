import { API_ERROR_CODES } from "../constants/api-error-codes.js";

export class ApiError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const resourceNotFoundError = (resourceName, id = null) => {
  const message = id
    ? `${resourceName} with id ${id} not found`
    : `${resourceName} not found`;

  return new ApiError(API_ERROR_CODES.RESOURCE_NOT_FOUND, message, 404);
};

export const duplicateResourceError = (resourceName, field = null) => {
  const message = field
    ? `${resourceName} with this ${field} already exists`
    : `${resourceName} already exists`;

  return new ApiError(API_ERROR_CODES.DUPLICATE_RESOURCE, message, 400);
};

export const invalidCredentialsError = (message = "Invalid credentials") => {
  return new ApiError(API_ERROR_CODES.INVALID_CREDENTIALS, message, 401);
};

export const authenticationError = (message = "User not found or inactive") => {
  return new ApiError(API_ERROR_CODES.AUTHENTICATION_ERROR, message, 401);
};

export const authorizationError = (message = "Insufficient permissions") => {
  return new ApiError(API_ERROR_CODES.AUTHORIZATION_ERROR, message, 403);
};

export const validationError = (message) => {
  return new ApiError(API_ERROR_CODES.VALIDATION_ERROR, message, 400);
};

export const validationErrorWithDetails = (
  details,
  message = "Validation failed"
) => {
  return new ApiError(API_ERROR_CODES.VALIDATION_ERROR, message, 400, {
    fields: details,
  });
};

export const refreshTokenInvalidError = (
  message = "Invalid or expired refresh token"
) => {
  return new ApiError(API_ERROR_CODES.REFRESH_TOKEN_INVALID, message, 401);
};

export const serverError = (message = "Internal server error") => {
  return new ApiError(API_ERROR_CODES.SERVER_ERROR, message, 500);
};

export const notFoundError = (message = "Resource not found") => {
  return new ApiError(API_ERROR_CODES.RESOURCE_NOT_FOUND, message, 404);
};

export const fileUploadError = (message = "File upload error") => {
  return new ApiError(API_ERROR_CODES.FILE_UPLOAD_ERROR, message, 400);
};

export const fileTooLargeError = (maxBytes) => {
  const message = `File size exceeds maximum allowed size of ${maxBytes} bytes`;
  return new ApiError(API_ERROR_CODES.FILE_TOO_LARGE, message, 400);
};

export const tokenExpiredError = (message = "Access token expired") => {
  return new ApiError(API_ERROR_CODES.TOKEN_EXPIRED, message, 401);
};

export const invalidTokenError = (message = "Invalid access token") => {
  return new ApiError(API_ERROR_CODES.INVALID_TOKEN, message, 401);
};

export const refreshTokenExpiredError = (message = "Refresh token expired") => {
  return new ApiError(API_ERROR_CODES.REFRESH_TOKEN_EXPIRED, message, 401);
};
