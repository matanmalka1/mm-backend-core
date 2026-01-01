import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";
import { successResponse } from "../utils/response.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(
        API_ERROR_CODES.FILE_UPLOAD_ERROR,
        "No file uploaded",
        400
      );
    }

    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    };

    successResponse(res, { file: fileInfo }, "File uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};
