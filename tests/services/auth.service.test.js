import { describe, expect, it } from "vitest";

import { RefreshToken } from "../../src/models/RefreshToken.js";
import { User } from "../../src/models/User.js";
import {
  register,
  login,
} from "../../src/services/auth/core.service.js";
import { refreshAccessToken, logout } from "../../src/services/auth/token.service.js";
import { hashRefreshToken } from "../../src/utils/auth-helpers.js";
import { hashPassword } from "../../src/utils/password.js";

import { createUser } from "../helpers.js";

describe("auth services", () => {
  it("registers a new user", async () => {
    const result = await register({
      email: "register-service@example.com",
      password: "Password123!",
      firstName: "Register",
      lastName: "Service",
    });

    expect(result.user.email).toBe("register-service@example.com");
    expect(result.user.password).toBeUndefined();
  });

  it("rejects duplicate registration", async () => {
    const { userRoleId } = globalThis.__roles;
    await User.create({
      email: "register-dup@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Dup",
      lastName: "User",
      role: userRoleId,
    });

    await expect(
      register({
        email: "register-dup@example.com",
        password: "Password123!",
        firstName: "Dup",
        lastName: "User",
      })
    ).rejects.toThrow(/already exists/i);
  });

  it("logs in and returns tokens", async () => {
    const { userRoleId } = globalThis.__roles;
    await createUser({
      email: "login-service@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const result = await login("login-service@example.com", "Password123!");
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it("refreshes tokens and revokes old refresh token", async () => {
    const { userRoleId } = globalThis.__roles;
    await createUser({
      email: "refresh-service@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const { refreshToken } = await login(
      "refresh-service@example.com",
      "Password123!"
    );

    const oldTokenHash = hashRefreshToken(refreshToken);
    const result = await refreshAccessToken(refreshToken);
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();

    const revoked = await RefreshToken.findOne({ token: oldTokenHash }).lean();
    expect(revoked.isRevoked).toBe(true);
  });

  it("logs out by revoking refresh token", async () => {
    const { userRoleId } = globalThis.__roles;
    await createUser({
      email: "logout-service@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const { user, refreshToken } = await login(
      "logout-service@example.com",
      "Password123!"
    );

    await logout(user._id.toString(), refreshToken);

    const token = await RefreshToken.findOne({ user: user._id }).lean();
    expect(token.isRevoked).toBe(true);
  });
});
