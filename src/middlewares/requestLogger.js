import morgan from "morgan";

import { stream } from "../utils/logger.js";

// Log incoming requests using morgan and winston stream.
export const requestLogger = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream }
);
