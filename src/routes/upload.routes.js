import express from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload, handleMulterError } from "../middlewares/upload.js";

export const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  handleMulterError,
  uploadController.uploadFile
);
