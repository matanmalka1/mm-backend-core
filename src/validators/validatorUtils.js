import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";

// Validate name length and characters.
export const isValidName = (value) =>
  typeof value === "string" && /^[A-Za-z]{2,15}$/.test(value.trim());

// Validate basic email format.
export const isValidEmail = (value) =>
  typeof value === "string" && /^\S+@\S+\.\S+$/.test(value.trim());

// Validate password strength requirements.
export const isValidPassword = (value) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return typeof value === "string" && passwordRegex.test(value);
};

// Validate positive integer values.
// export const isPositiveInteger = (value) =>
//   Number.isInteger(value) && value > 0;

// Wrap validation errors in ApiError payload.
export const buildValidationError = (details) =>
  new ApiError(API_ERROR_CODES.VALIDATION_ERROR, "Validation failed", 400, {
    fields: details,
  });
