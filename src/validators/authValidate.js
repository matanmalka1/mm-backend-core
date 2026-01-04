import {
  buildValidationError,
  isValidName,
  isValidEmail,
  isValidPassword,
} from "./validatorUtils.js";

export const validateRegister = (req, _res, next) => {
  const { email, password, firstName, lastName } = req.body ?? {};
  const errors = [];
  
  if (!isValidEmail(email))
    errors.push({ field: "email", message: "Email must be a valid address" });
  
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
        "Password must be at least 8 characters and include upper, lower, and number",
    });
  }
  
  return errors.length ? next(buildValidationError(errors)) : next();
  return next();
};

export const validateLogin = (req, _res, next) => {
  // NOTE: Validation handled by the Mongoose model.
  const { email, password } = req.body ?? {};
  const errors = [];
  
  if (!isValidEmail(email))
    errors.push({ field: "email", message: "Email must be a valid address" });
  
  if (!isValidPassword(password))
    errors.push({ field: "password", message: "Password must be at least 8 characters and include upper, lower, and number" });
  
  return errors.length > 0 ? next(buildValidationError(errors)) : next();
  return next();
};
