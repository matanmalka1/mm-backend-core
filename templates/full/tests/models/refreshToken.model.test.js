import { describe, expect, it } from "vitest";

import { RefreshToken } from "../../src/models/RefreshToken.js";
import { Role } from "../../src/models/Role.js";
import { User } from "../../src/models/User.js";
import { hashPassword } from "../../src/utils/password.js";

describe("RefreshToken model", () => {
  it("requires token, user, expiresAt", async () => {
    const token = new RefreshToken({});
    await expect(token.validate()).rejects.toThrow();
  });

  it("creates refresh token", async () => {
    const role = await Role.create({ name: "refresh-role", description: "" });
    const user = await User.create({
      email: "refresh-token@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Refresh",
      lastName: "Token",
      role: role._id,
    });

    const token = await RefreshToken.create({
      token: "token",
      user: user._id,
      expiresAt: new Date(Date.now() + 1000),
    });

    expect(token.user.toString()).toBe(user._id.toString());
  });
});
