import { describe, expect, it } from "vitest";

import {
  validateChangePassword,
  validateLogin,
  validateRegister,
  validateUpdateProfile,
} from "../../src/validators/authValidate.js";

const runMiddleware = (middleware, body = {}) =>
  new Promise((resolve) => {
    const req = { body };
    middleware(req, {}, (err) => resolve(err));
  });

describe("auth validators", () => {
  it("validates register payload", async () => {
    const err = await runMiddleware(validateRegister, {
      email: "valid@example.com",
      password: "Password123!",
      firstName: "Valid",
      lastName: "User",
    });

    expect(err).toBeUndefined();
  });

  it("rejects invalid login payload", async () => {
    const err = await runMiddleware(validateLogin, {
      email: "bad",
      password: "short",
    });

    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.details.fields.length).toBeGreaterThan(0);
  });

  it("validates password change payload", async () => {
    const err = await runMiddleware(validateChangePassword, {
      currentPassword: "Password123!",
      newPassword: "Password456!",
    });

    expect(err).toBeUndefined();
  });

  it("validates update profile payload", async () => {
    const err = await runMiddleware(validateUpdateProfile, {
      phoneNumber: "+1 555 555 5555",
      bio: "Short bio",
      shippingAddress: { city: "NY" },
    });

    expect(err).toBeUndefined();
  });
});
