import { Router } from "express";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use(healthRoutes);

export default router;
