import { describe, expect, it } from "vitest";

import { Role } from "../../src/models/Role.js";
import { ensureDefaultUserRole } from "../../src/utils/role-utils.js";

describe("role utils", () => {
  it("creates default user role if missing", async () => {
    await Role.deleteMany({ name: "user" });

    const role = await ensureDefaultUserRole();
    expect(role.name).toBe("user");
  });
});
