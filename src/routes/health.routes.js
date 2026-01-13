import express from "express";
import mongoose from "mongoose";

import { successResponse } from "../utils/response.js";

export const router = express.Router();

// Health check endpoint with DB connectivity status.
router.get("/health", async (_req, res, next) => {
  try {
    // Check MongoDB connection
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    const healthData = {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
    };

    successResponse(res, healthData, "Server is healthy");
  } catch (error) {
    next(error);
  }
});
