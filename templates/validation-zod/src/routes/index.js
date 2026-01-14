import { Router } from "express";
import healthRoutes from "./health.routes.js";
import usersRoutes from "./users.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(usersRoutes);

export default router;
