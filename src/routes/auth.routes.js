import express from "express";

import {
  register,
  login,
  logout,
  refresh,
  me,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  authRateLimiter,
  passwordChangeRateLimiter,
  refreshRateLimiter,
  forgotPasswordRateLimiter,
} from "../middlewares/rateLimiter.js";
import {
  validateLogin,
  validateRegister,
  validateChangePassword,
  validateUpdateProfile,
  validateForgotPassword,
  validateResetPassword,
} from "../validators/authValidate.js";

export const router = express.Router();

router.post("/register", authRateLimiter, validateRegister, register);
router.post("/login", authRateLimiter, validateLogin, login);
router.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  validateForgotPassword,
  forgotPassword
);
router.post("/reset-password", validateResetPassword, resetPassword);
router.post("/logout", authenticate, logout);
router.post("/refresh", refreshRateLimiter, refresh);
router.get("/me", authenticate, me);
router.post(
  "/change-password",
  authenticate,
  passwordChangeRateLimiter,
  validateChangePassword,
  changePassword
);
router.put("/profile", authenticate, validateUpdateProfile, updateProfile);
