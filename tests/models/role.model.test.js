import { describe, expect, it } from "vitest";

import { Role } from "../../src/models/Role.js";

describe("Role model", () => {
  it("requires name", async () => {
    const role = new Role({});
    await expect(role.validate()).rejects.toThrow();
  });

  it("creates role", async () => {
    const role = await Role.create({ name: "role-model", description: "" });
    expect(role.name).toBe("role-model");
  });
});
