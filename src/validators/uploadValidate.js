import { unlink } from "fs/promises";

import { fileTypeFromFile } from "file-type";

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
    } else if (req.file.path) {
      try {
        const detectedType = await fileTypeFromFile(req.file.path);

        if (!detectedType || detectedType.mime !== req.file.mimetype) {
          errors.push({
            field: "file",
            message: "File content does not match its declared type",
          });
        }
      } catch {
        errors.push({
          field: "file",
          message: "Unable to validate uploaded file content",
        });
      }
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
