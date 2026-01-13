import { describe, expect, it } from "vitest";

import { Permission } from "../../src/models/Permission.js";
import { ensurePermissions } from "../../src/utils/permission-utils.js";

describe("permission utils", () => {
  it("ensures permissions exist", async () => {
    const permissions = [
      { name: "posts.read", resource: "posts", action: "read" },
      { name: "posts.write", resource: "posts", action: "write" },
    ];

    const map = await ensurePermissions(permissions);
    expect(map["posts.read"]).toBeTruthy();
    expect(map["posts.write"]).toBeTruthy();

    const count = await Permission.countDocuments({
      name: { $in: ["posts.read", "posts.write"] },
    });
    expect(count).toBe(2);
  });
});
