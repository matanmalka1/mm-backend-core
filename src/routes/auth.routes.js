import express from "express";
import {register,login,logout,refresh,me} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";
import { validateLogin, validateRegister } from "../validators/authValidate.js";

export const router = express.Router();

router.post("/register", authRateLimiter, validateRegister, register);
router.post("/login",authRateLimiter, validateLogin, login);
router.post("/logout", authenticate, logout);
router.post("/refresh", authRateLimiter, refresh);
router.get("/me", authenticate, me);
