import express from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload, handleMulterError } from "../middlewares/upload.js";
import { validateUpload } from "../validators/uploadValidate.js";

export const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  handleMulterError,
  validateUpload,
  uploadFile
);
