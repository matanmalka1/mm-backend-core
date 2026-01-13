import { describe, expect, it } from "vitest";

import {
  validateCreateUser,
  validateUpdateUser,
  validateUserIdParam,
  validateUserListQuery,
} from "../../src/validators/userValidate.js";

const runMiddleware = (middleware, req) =>
  new Promise((resolve) => {
    middleware(req, {}, (err) => resolve(err));
  });

describe("user validators", () => {
  it("validates create user payload", async () => {
    const { userRoleId } = globalThis.__roles;
    const err = await runMiddleware(validateCreateUser, {
      body: {
        email: "valid@example.com",
        password: "Password123!",
        firstName: "Valid",
        lastName: "User",
        roleId: userRoleId,
      },
    });

    expect(err).toBeUndefined();
  });

  it("rejects invalid user id param", async () => {
    const err = await runMiddleware(validateUserIdParam, {
      params: { id: "bad-id" },
    });

    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("validates update user payload", async () => {
    const err = await runMiddleware(validateUpdateUser, {
      body: { firstName: "Update" },
    });

    expect(err).toBeUndefined();
  });

  it("validates list query", async () => {
    const err = await runMiddleware(validateUserListQuery, {
      query: { page: "1", limit: "10" },
    });

    expect(err).toBeUndefined();
  });
});
