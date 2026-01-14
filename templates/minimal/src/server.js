import "./config/env.js";
import { app } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

let server;
let isShuttingDown = false;

const closeServer = () =>
  new Promise((resolve, reject) => {
    if (!server) return resolve();
    server.close((error) => {
      if (error) return reject(error);
      return resolve();
    });
  });

const shutdown = async (reason, exitCode = 0) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info("Graceful shutdown initiated", { reason });

  try {
    await closeServer();
    await disconnectDB();
  } catch (error) {
    logger.error("Error during shutdown", { error: error.message });
    exitCode = 1;
  } finally {
    process.exit(exitCode);
  }
};

// Initialize database connection and start HTTP server.
const startServer = async () => {
  try {
    await connectDB();

    const port = +process.env.PORT || 3000;
    server = app.listen(port, () => {
      logger.info(`Server is live, listening on port: ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  shutdown("uncaughtException", 1);
});

// Handle unhandled promise rejections.
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
  shutdown("unhandledRejection", 1);
});

process.on("SIGINT", () => shutdown("SIGINT", 0));
process.on("SIGTERM", () => shutdown("SIGTERM", 0));

// Log startup failures not caught inside startServer.
startServer().catch((error) => {
  logger.error("Failed to start server", { error: error.message });
  process.exit(1);
});
