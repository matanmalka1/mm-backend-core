import { describe, expect, it } from "vitest";

import { Role } from "../../src/models/Role.js";
import { User } from "../../src/models/User.js";

import { hashPassword } from "../../src/utils/password.js";

describe("User model", () => {
  it("requires required fields", async () => {
    const user = new User({});
    await expect(user.validate()).rejects.toThrow();
  });

  it("creates valid user", async () => {
    const role = await Role.create({ name: "model-user", description: "" });

    const user = await User.create({
      email: "model@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Model",
      lastName: "User",
      role: role._id,
    });

    expect(user.email).toBe("model@example.com");
  });
});
