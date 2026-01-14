import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.js";

const router = Router();
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

router.post("/users", validate(schema), (req, res) => {
  res.status(201).json({ user: req.body });
});

export default router;
