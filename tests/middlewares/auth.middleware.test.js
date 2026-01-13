import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/utils/auth-helpers.js", () => ({
  getUserFromToken: vi.fn(),
}));

import { getUserFromToken } from "../../src/utils/auth-helpers.js";
import {
  authenticate,
  authorize,
  checkPermission,
} from "../../src/middlewares/auth.middleware.js";

describe("auth middleware", () => {
  it("rejects when no bearer token", async () => {
    const req = { headers: {} };
    const next = vi.fn();

    await authenticate(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].code).toBe("AUTHENTICATION_ERROR");
  });

  it("attaches user when token is valid", async () => {
    const req = { headers: { authorization: "Bearer token" } };
    const next = vi.fn();

    getUserFromToken.mockResolvedValue({ id: "user1" });

    await authenticate(req, {}, next);

    expect(req.user).toEqual({ id: "user1" });
    expect(next).toHaveBeenCalledWith();
  });

  it("authorize allows matching role", async () => {
    const req = { user: { role: { name: "admin" } } };
    const next = vi.fn();

    await authorize("admin")(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("authorize rejects mismatched role", async () => {
    const req = { user: { role: { name: "user" } } };
    const next = vi.fn();

    await authorize("admin")(req, {}, next);

    expect(next.mock.calls[0][0].code).toBe("AUTHORIZATION_ERROR");
  });

  it("checkPermission allows matching permission", async () => {
    const req = {
      user: {
        role: {
          permissions: [{ resource: "users", action: "update" }],
        },
      },
    };
    const next = vi.fn();

    await checkPermission("users", "update")(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });
});
