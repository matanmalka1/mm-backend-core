import express from "express";
import { router as authRoutes } from "./auth.routes.js";
import { router as userRoutes } from "./user.routes.js";
import { router as healthRoutes } from "./health.routes.js";
import { router as uploadRoutes } from "./upload.routes.js";

export const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/", healthRoutes);
