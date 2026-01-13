import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import {
  authenticate,
  authorize,
  checkPermission,
} from "../middlewares/auth.middleware.js";
import {
  validateCreateUser,
  validateUpdateUser,
  validateUserIdParam,
} from "../validators/userValidate.js";

export const router = express.Router();
// CREATE
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateCreateUser,
  createUser
);
// READ ALL
router.get("/", authenticate, getAllUsers);
// READ ONE
router.get("/:id", authenticate, validateUserIdParam, getUserById);
// UPDATE
router.put(
  "/:id",
  authenticate,
  checkPermission("users", "update"),
  validateUserIdParam,
  validateUpdateUser,
  updateUser
);
// DELETE
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("users", "delete"),
  validateUserIdParam,
  deleteUser
);
