import { existsSync, mkdirSync } from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

import multer from "multer";

import {
  fileTooLargeError,
  fileUploadError,
} from "../utils/error-factories.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, "../../uploads");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const safeBaseName = (value) =>
  String(value || "file")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 50) || "file";

const safeExtension = (value) => {
  const rawExt = extname(String(value || "")).toLowerCase();
  const cleaned = rawExt.replace(/[^a-z0-9.]/g, "");
  if (!cleaned || cleaned === ".") {
    return ".bin";
  }
  return cleaned;
};

// Configure disk storage for uploaded files.
const storage = multer.diskStorage({
  // Resolve upload destination folder.
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  // Generate a unique filename for the uploaded file.
  filename: (_req, file, cb) => {
    const baseName = safeBaseName(file.fieldname);
    const ext = safeExtension(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const maxFileSize = +process.env.MAX_FILE_SIZE || 5 * 1024 * 1024;

// Multer middleware with storage and file size limits.
export const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
});

// Translate multer errors into ApiError responses.
export const handleMulterError = (err, _req, _res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(fileTooLargeError(maxFileSize));
    }
    return next(fileUploadError(err.message));
  }
  next(err);
};
