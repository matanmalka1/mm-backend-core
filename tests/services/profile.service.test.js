import { describe, expect, it } from "vitest";

import { updateProfile } from "../../src/services/auth/profile.service.js";
import { User } from "../../src/models/User.js";
import { hashPassword } from "../../src/utils/password.js";

import { createUser } from "../helpers.js";

describe("profile service", () => {
  it("updates allowed fields and maps shipping address", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await createUser({
      email: "profile-service@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const updated = await updateProfile(user._id.toString(), {
      firstName: "Updated",
      bio: "Bio",
      shippingAddress: { city: "Austin" },
    });

    expect(updated.firstName).toBe("Updated");
    expect(updated.defaultShippingAddress.city).toBe("Austin");
  });

  it("throws when user missing", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await User.create({
      email: "missing@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Missing",
      lastName: "User",
      role: userRoleId,
    });

    await user.deleteOne();

    await expect(
      updateProfile(user._id.toString(), { firstName: "Nope" })
    ).rejects.toThrow(/not found/i);
  });
});
