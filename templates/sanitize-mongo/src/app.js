import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
