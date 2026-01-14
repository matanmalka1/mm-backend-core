import express from "express";
import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { limiter } from "./middlewares/rateLimit.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter);

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
