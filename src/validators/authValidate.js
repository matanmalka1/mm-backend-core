import { z } from "zod";

import {
  emailSchema,
  nameSchema,
  passwordSchema,
  runSchema,
} from "./validatorUtils.js";

export const validateRegister = (req, _res, next) => {
  const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema(),
    firstName: nameSchema("First name"),
    lastName: nameSchema("Last name"),
  });

  return runSchema(registerSchema, req.body ?? {}, next);
};

export const validateLogin = (req, _res, next) => {
  const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema(),
  });

  return runSchema(loginSchema, req.body ?? {}, next);
};

export const validateChangePassword = (req, _res, next) => {
  const changePasswordSchema = z.object({
    currentPassword: passwordSchema("Current password"),
    newPassword: passwordSchema("New password"),
  });

  return runSchema(changePasswordSchema, req.body ?? {}, next);
};

export const validateUpdateProfile = (req, _res, next) => {
  const phoneMessage =
    "Phone number must be at least 10 characters and contain only digits, spaces, and +-() characters";
  const phoneSchema = z
    .string({ invalid_type_error: phoneMessage })
    .min(10, { message: phoneMessage })
    .regex(/^[\d\s()+-]+$/, { message: phoneMessage });

  const shippingAddressSchema = z
    .object(
      {
        street: z
          .string({
            invalid_type_error: "Street must be at least 3 characters",
          })
          .trim()
          .min(3, { message: "Street must be at least 3 characters" })
          .optional(),
        city: z
          .string({ invalid_type_error: "City must be at least 2 characters" })
          .trim()
          .min(2, { message: "City must be at least 2 characters" })
          .optional(),
        state: z
          .string({ invalid_type_error: "State must be at least 2 characters" })
          .trim()
          .min(2, { message: "State must be at least 2 characters" })
          .optional(),
        zipCode: z
          .string({
            invalid_type_error: "Zip code must be at least 3 characters",
          })
          .trim()
          .min(3, { message: "Zip code must be at least 3 characters" })
          .optional(),
        country: z
          .string({
            invalid_type_error: "Country must be at least 2 characters",
          })
          .trim()
          .min(2, { message: "Country must be at least 2 characters" })
          .optional(),
      },
      { invalid_type_error: "Shipping address must be an object" }
    )
    .passthrough();

  const updateProfileSchema = z
    .object({
      firstName: nameSchema("First name").optional(),
      lastName: nameSchema("Last name").optional(),
      phoneNumber: phoneSchema.optional().nullable(),
      bio: z
        .string({
          invalid_type_error:
            "Bio must be a string with maximum 500 characters",
        })
        .max(500, {
          message: "Bio must be a string with maximum 500 characters",
        })
        .optional()
        .nullable(),
      shippingAddress: shippingAddressSchema.optional().nullable(),
    })
    .passthrough();

  return runSchema(updateProfileSchema, req.body ?? {}, next);
};
