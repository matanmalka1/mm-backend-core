import { Router } from "express";
import healthRoutes from "./health.routes.js";
import docsRoutes from "./docs.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(docsRoutes);

export default router;
