import { describe, expect, it } from "vitest";

import { User } from "../../src/models/User.js";
import {
  getRefreshTokenExpiration,
  getUserFromToken,
  hashRefreshToken,
  sanitizeUser,
} from "../../src/utils/auth-helpers.js";
import { generateAccessToken } from "../../src/utils/jwt.js";

import { createUser } from "../helpers.js";

describe("auth-helpers", () => {
  it("hashRefreshToken is deterministic", () => {
    const token = "token-value";
    const first = hashRefreshToken(token);
    const second = hashRefreshToken(token);
    expect(first).toBe(second);
  });

  it("getRefreshTokenExpiration returns ~7 days", () => {
    const now = Date.now();
    const expiresAt = getRefreshTokenExpiration();
    const diffMs = expiresAt.getTime() - now;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    expect(diffMs).toBeGreaterThan(sevenDaysMs - 2000);
    expect(diffMs).toBeLessThan(sevenDaysMs + 2000);
  });

  it("sanitizeUser removes password from document and plain object", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await createUser({
      email: "sanitize@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const sanitizedDoc = sanitizeUser(user);
    expect(sanitizedDoc.password).toBeUndefined();

    const sanitizedPlain = sanitizeUser({ password: "secret", email: "a@b.com" });
    expect(sanitizedPlain.password).toBeUndefined();
  });

  it("getUserFromToken returns user for valid token", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await createUser({
      email: "token@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const accessToken = generateAccessToken({ userId: user._id.toString() });
    const loaded = await getUserFromToken(`Bearer ${accessToken}`, {
      includePermissions: true,
    });

    expect(loaded.email).toBe("token@example.com");
    expect(loaded.role).toBeTruthy();
  });

  it("getUserFromToken returns null for inactive user", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await User.create({
      email: "inactive@example.com",
      password: "Password123!",
      firstName: "Inactive",
      lastName: "User",
      role: userRoleId,
      isActive: false,
    });

    const accessToken = generateAccessToken({ userId: user._id.toString() });
    const loaded = await getUserFromToken(`Bearer ${accessToken}`);

    expect(loaded).toBeNull();
  });
});
