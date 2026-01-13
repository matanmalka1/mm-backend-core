import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUploadError } from "../utils/error-factories.js";
import { successResponse } from "../utils/response.js";

// Handle single file upload response payload.
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw fileUploadError("No file uploaded");
  }

  const fileInfo = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
  };

  successResponse(res, { file: fileInfo }, "File uploaded successfully", 201);
});
