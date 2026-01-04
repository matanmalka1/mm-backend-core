import "./config/env.js";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

// Initialize database connection and start HTTP server.
const startServer = async () => {
  try {
    await connectDB();

    const port = +process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Server is live, listening on port: ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections.
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Log startup failures not caught inside startServer.
startServer().catch((error) => {
  logger.error("Failed to start server", { error: error.message });
  process.exit(1);
});
