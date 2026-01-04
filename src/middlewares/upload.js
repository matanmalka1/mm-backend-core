import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, "../../uploads");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage for uploaded files.
const storage = multer.diskStorage({
  // Resolve upload destination folder.
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  // Generate a unique filename for the uploaded file.
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

// Multer middleware with storage only; validation happens in uploadValidate.
export const upload = multer({
  storage,
});

// Translate multer errors into ApiError responses.
export const handleMulterError = (err, _req, _res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new ApiError(
          API_ERROR_CODES.FILE_TOO_LARGE,
          `File size exceeds maximum allowed size of ${+process.env
            .MAX_FILE_SIZE} bytes`,
          400
        )
      );
    }
    return next(
      new ApiError(API_ERROR_CODES.FILE_UPLOAD_ERROR, err.message, 400)
    );
  }
  next(err);
};
