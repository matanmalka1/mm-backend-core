import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

export const router = express.Router();
// CREATE 
router.post("/", authenticate, authorize("admin"), userController.createUser);
// READ ALL
router.get("/", authenticate, userController.getAllUsers);
// READ ONE
router.get("/:id", authenticate, userController.getUserById);
// UPDATE
router.put("/:id", authenticate, userController.updateUser);
// DELETE
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.deleteUser
);


