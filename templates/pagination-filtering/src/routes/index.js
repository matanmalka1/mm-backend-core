import { Router } from "express";
import healthRoutes from "./health.routes.js";
import itemsRoutes from "./items.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(itemsRoutes);

export default router;
