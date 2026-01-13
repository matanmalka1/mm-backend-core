import { z } from "zod";

import {
  emailSchema,
  isValidObjectId,
  nameSchema,
  objectIdSchema,
  passwordSchema,
  runSchema,
} from "./validatorUtils.js";

export const validateUserIdParam = (req, _res, next) => {
  const paramsSchema = z.object({
    id: objectIdSchema("user"),
  });

  return runSchema(paramsSchema, req.params ?? {}, next);
};

export const validateCreateUser = (req, _res, next) => {
  const createUserSchema = z.object({
    email: emailSchema,
    password: passwordSchema(),
    firstName: nameSchema("First name"),
    lastName: nameSchema("Last name"),
    roleId: z
      .string({
        required_error: "Valid roleId is required",
        invalid_type_error: "Valid roleId is required",
      })
      .refine(isValidObjectId, {
        message: "Valid roleId is required",
      }),
  });

  return runSchema(createUserSchema, req.body ?? {}, next);
};

export const validateUpdateUser = (req, _res, next) => {
  const updateUserSchema = z.object({
    email: emailSchema.optional(),
    firstName: nameSchema("First name").optional(),
    lastName: nameSchema("Last name").optional(),
    isActive: z
      .boolean({ invalid_type_error: "isActive must be a boolean" })
      .optional(),
    roleId: z
      .string({
        invalid_type_error: "Valid roleId is required",
      })
      .refine(isValidObjectId, {
        message: "Valid roleId is required",
      })
      .optional(),
  });

  return runSchema(updateUserSchema, req.body ?? {}, next);
};
