import * as userService from "../services/user.service.js";
import { successResponse } from "../utils/response.js";

// CREATE
export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    successResponse(res, { user }, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// READ ALL
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);

    successResponse(res, result, "Users retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// READ ONE
export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    successResponse(res, { user }, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    successResponse(res, { user }, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);

    successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
