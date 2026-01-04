import mongoose from "mongoose";
import {
  buildValidationError,
  isValidName,
  isValidEmail,
  isValidPassword,
} from "./validatorUtils.js";

// Validate user id route param.
export const validateUserIdParam = (req, _res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      buildValidationError([{ field: "id", message: "Invalid user ID format" }])
    );
  }

  return next();
};

// Validate payload for user creation.
export const validateCreateUser = (req, _res, next) => {
  // NOTE: Validation handled by the Mongoose model.
  const { email, password, firstName, lastName, roleId } = req.body ?? {};
  const errors = [];
  
  if (!isValidEmail(email)) {
    errors.push({ field: "email", message: "Email must be a valid address" });
  }
  
  if (!isValidName(firstName)) {
    errors.push({
      field: "firstName",
      message: "First name must be 2-15 letters with no spaces",
    });
  }
  
  if (!isValidName(lastName)) {
    errors.push({
      field: "lastName",
      message: "Last name must be 2-15 letters with no spaces",
    });
  }
  
  if (!isValidPassword(password)) {
    errors.push({
      field: "password",
      message:
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)",
    });
  }
  
  if (!roleId || !mongoose.Types.ObjectId.isValid(roleId)) {
    errors.push({ field: "roleId", message: "Valid roleId is required" });
  }
  
  if (errors.length) {
    return next(buildValidationError(errors));
  }
  
  return next();
};

// Validate payload for user updates.
export const validateUpdateUser = (req, _res, next) => {
  // NOTE: Validation handled by the Mongoose model.
  const { email, firstName, lastName, isActive, roleId } = req.body ?? {};
  const errors = [];
  
  if (email !== undefined) {
    if (!isValidEmail(email)) {
      errors.push({ field: "email", message: "Email must be a valid address" });
    }
  }
  
  if (firstName !== undefined && !isValidName(firstName)) {
    errors.push({
      field: "firstName",
      message: "First name must be 2-15 letters with no spaces",
    });
  }
  
  if (lastName !== undefined && !isValidName(lastName)) {
    errors.push({
      field: "lastName",
      message: "Last name must be 2-15 letters with no spaces",
    });
  }
  
  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push({ field: "isActive", message: "isActive must be a boolean" });
  }
  
  if (roleId !== undefined && !mongoose.Types.ObjectId.isValid(roleId)) {
    errors.push({
      field: "roleId",
      message: "Valid roleId is required",
    });
  }
  
  if (errors.length) {
    return next(buildValidationError(errors));
  }
  
  return next();
};
