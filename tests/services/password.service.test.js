import { describe, expect, it } from "vitest";

import { User } from "../../src/models/User.js";
import { changePassword } from "../../src/services/auth/password.service.js";
import { hashPassword } from "../../src/utils/password.js";

import { createUser } from "../helpers.js";

describe("password service", () => {
  it("updates password when valid", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await createUser({
      email: "pw@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    await changePassword(user._id.toString(), "Password123!", "Password456!");

    const stored = await User.findById(user._id).select("+password");
    expect(stored.password).not.toBe("Password123!");
  });

  it("rejects oauth users", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await User.create({
      email: "oauthpw@example.com",
      password: await hashPassword("Password123!"),
      firstName: "OAuth",
      lastName: "User",
      role: userRoleId,
      oauth: { google: { id: "g1" } },
    });

    await expect(
      changePassword(user._id.toString(), "Password123!", "Password456!")
    ).rejects.toThrow(/OAuth users cannot change password/i);
  });
});
