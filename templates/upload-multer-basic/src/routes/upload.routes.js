import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: uploadDir });

router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename, originalName: req.file.originalname });
});

export default router;
