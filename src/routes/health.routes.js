import express from "express";
import { successResponse } from "../utils/response.js";

export const router = express.Router();
// HEALTH CHECK
router.get("/health", (_req, res) => {
  const healthData = {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  successResponse(res, healthData, "Server is healthy");
});
