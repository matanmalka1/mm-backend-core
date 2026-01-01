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

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES
    ? process.env.ALLOWED_FILE_TYPES.split(",").map((value) => value.trim())
    : ["image/jpeg", "image/png", "image/gif", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(
    new ApiError(
      API_ERROR_CODES.INVALID_FILE_TYPE,
      `File type ${file.mimetype} is not allowed`,
      400
    ),
    false
  );
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 5 * 1024 * 1024,
  },
});

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
