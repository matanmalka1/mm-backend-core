import mongoose from "mongoose";

import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: +process.env.MONGO_MAX_POOL_SIZE || 20,
      minPoolSize: +process.env.MONGO_MIN_POOL_SIZE || 2,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Log MongoDB connection errors.
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error", { error: err.message });
    });

    // Log MongoDB disconnects.
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    return conn;
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB Disconnected");
  } catch (error) {
    logger.error("Error disconnecting from MongoDB", { error: error.message });
  }
};
