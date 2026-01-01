import express from "express";
import {register,login,logout,refresh,me} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

export const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login",authRateLimiter, login);
router.post("/logout", authenticate, logout);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);
