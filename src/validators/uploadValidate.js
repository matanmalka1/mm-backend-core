import { unlink } from "fs/promises";

import { buildValidationError } from "./validatorUtils.js";

// Validate that a file was uploaded.
export const validateUpload = async (req, _res, next) => {
  const errors = [];

  if (!req.file) {
    errors.push({ field: "file", message: "File is required" });
  }

  if (req.file) {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES
      ? process.env.ALLOWED_FILE_TYPES.split(",").map((value) => value.trim())
      : ["image/jpeg", "image/png", "image/gif", "application/pdf"];

    if (!allowedTypes.includes(req.file.mimetype)) {
      errors.push({
        field: "file",
        message: `File type ${req.file.mimetype} is not allowed`,
      });
    }
  }

  if (errors.length) {
    if (req.file?.path) {
      try {
        await unlink(req.file.path);
      } catch {
        // Ignore cleanup errors to avoid masking validation results.
      }
    }
    return next(buildValidationError(errors));
  }

  return next();
};
