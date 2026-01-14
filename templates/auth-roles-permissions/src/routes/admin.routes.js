import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { requirePermission } from "../middlewares/requirePermission.js";

const router = Router();

router.get("/dashboard", auth, requireRole("admin"), (req, res) => {
  res.json({ message: "admin access granted" });
});

router.get("/reports", auth, requirePermission("read:reports"), (req, res) => {
  res.json({ message: "reports access granted" });
});

export default router;
