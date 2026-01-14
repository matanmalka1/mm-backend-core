import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const specPath = path.resolve(__dirname, "..", "openapi.json");
const openapi = JSON.parse(fs.readFileSync(specPath, "utf8"));

const router = Router();
router.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

export default router;
