import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

const router = Router();
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const allowed = env.ALLOWED_MIME.split(",").map((t) => t.trim());

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename, originalName: req.file.originalname });
});

export default router;
