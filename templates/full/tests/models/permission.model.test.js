import { describe, expect, it } from "vitest";

import { Permission } from "../../src/models/Permission.js";

describe("Permission model", () => {
  it("requires resource and action", async () => {
    const permission = new Permission({ name: "perm" });
    await expect(permission.validate()).rejects.toThrow();
  });

  it("creates permission", async () => {
    const permission = await Permission.create({
      name: "perm.read",
      resource: "perm",
      action: "read",
    });
    expect(permission.resource).toBe("perm");
  });
});
