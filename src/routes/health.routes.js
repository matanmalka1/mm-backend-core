import express from "express";
import { sequelize } from "../config/db.js";
import { successResponse } from "../utils/response.js";

export const router = express.Router();
// HEALTH CHECK
router.get("/health", async (_req, res, next) => {
  try {
    await sequelize.authenticate();

    const healthData = {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: "connected",
    };

    successResponse(res, healthData, "Server is healthy");
  } catch (error) {
    next(error);
  }
});
