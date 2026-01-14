import mongoose from "mongoose";
import { z } from "zod";

import { validationErrorWithDetails } from "../utils/error-factories.js";

const PASSWORD_REQUIREMENTS_MESSAGE =
  "must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const formatZodPath = (path) =>
  path.reduce((acc, segment) => {
    if (typeof segment === "number") {
      return `${acc}[${segment}]`;
    }
    return acc ? `${acc}.${segment}` : segment;
  }, "");

export const zodErrorsToFields = (error) =>
  error.issues.map((issue) => ({
    field: formatZodPath(issue.path) || "value",
    message: issue.message,
  }));

export const buildValidationError = (details) =>
  validationErrorWithDetails(details);

export const runSchema = (schema, data, next) => {
  const result = schema.safeParse(data);
  if (result.success) return next();
  return next(buildValidationError(zodErrorsToFields(result.error)));
};

export const validateObjectIdParam =
  (label, paramName = "id") =>
  (req, _res, next) => {
    const paramsSchema = z.object({
      [paramName]: objectIdSchema(label),
    });
    return runSchema(paramsSchema, req.params ?? {}, next);
  };

export const isValidObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value);

export const objectIdSchema = (label) =>
  z
    .string({
      required_error: `Invalid ${label} ID format`,
      invalid_type_error: `Invalid ${label} ID format`,
    })
    .refine(isValidObjectId, {
      message: `Invalid ${label} ID format`,
    });

export const emailSchema = z
  .string({
    required_error: "Email must be a valid address",
    invalid_type_error: "Email must be a valid address",
  })
  .trim()
  .email({ message: "Email must be a valid address" });

export const nameSchema = (label) =>
  z
    .string({
      required_error: `${label} must be 2-15 letters with no spaces`,
      invalid_type_error: `${label} must be 2-15 letters with no spaces`,
    })
    .trim()
    .regex(/^[A-Za-z]{2,15}$/, {
      message: `${label} must be 2-15 letters with no spaces`,
    });

export const passwordSchema = (label = "Password") =>
  z
    .string({
      required_error: `${label} ${PASSWORD_REQUIREMENTS_MESSAGE}`,
      invalid_type_error: `${label} ${PASSWORD_REQUIREMENTS_MESSAGE}`,
    })
    .refine((value) => PASSWORD_REGEX.test(value), {
      message: `${label} ${PASSWORD_REQUIREMENTS_MESSAGE}`,
    });

export const nonEmptyStringSchema = (message) =>
  z
    .string({ required_error: message, invalid_type_error: message })
    .trim()
    .min(1, { message });

export const nonNegativeNumberSchema = (message) =>
  z
    .number({ required_error: message, invalid_type_error: message })
    .refine((value) => Number.isFinite(value) && value >= 0, { message });

export const positiveIntegerSchema = (message) =>
  z
    .number({ required_error: message, invalid_type_error: message })
    .int()
    .gt(0, { message });

export const ratingSchema = z
  .number({
    required_error: "Rating must be between 1 and 5",
    invalid_type_error: "Rating must be between 1 and 5",
  })
  .refine((value) => value >= 1 && value <= 5, {
    message: "Rating must be between 1 and 5",
  });
