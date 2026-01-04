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
      
    const maxFileSize = +process.env.MAX_FILE_SIZE || 5 * 1024 * 1024;

    if (!allowedTypes.includes(req.file.mimetype)) {
      errors.push({
        field: "file",
        message: `File type ${req.file.mimetype} is not allowed`,
      });
    }

    if (req.file.size > maxFileSize) {
      errors.push({
        field: "file",
        message: `File size exceeds maximum allowed size of ${maxFileSize} bytes`,
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
