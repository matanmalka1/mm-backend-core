import { Router } from "express";
import healthRoutes from "./health.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use(healthRoutes);
router.use("/files", uploadRoutes);

export default router;
