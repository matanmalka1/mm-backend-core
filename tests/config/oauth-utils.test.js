import { describe, expect, it } from "vitest";

import { User } from "../../src/models/User.js";
import { findOrCreateUser } from "../../src/config/oauth/oauth-utils.js";
import { hashPassword } from "../../src/utils/password.js";
import { ensureDefaultUserRole } from "../../src/utils/role-utils.js";

describe("oauth utils", () => {
  it("finds user by oauth id", async () => {
    const role = await ensureDefaultUserRole();
    const user = await User.create({
      email: "oauth-id@example.com",
      password: await hashPassword("Password123!"),
      firstName: "OAuth",
      lastName: "User",
      role: role._id,
      oauth: { google: { id: "gid" } },
    });

    const profile = { id: "gid", displayName: "OAuth User" };
    const found = await findOrCreateUser(profile, "google");

    expect(found._id.toString()).toBe(user._id.toString());
  });

  it("links user by email", async () => {
    const role = await ensureDefaultUserRole();
    const user = await User.create({
      email: "email-link@example.com",
      password: await hashPassword("Password123!"),
      firstName: "Email",
      lastName: "User",
      role: role._id,
    });

    const profile = {
      id: "gid2",
      emails: [{ value: "email-link@example.com", verified: true }],
      displayName: "Email User",
    };
    const found = await findOrCreateUser(profile, "google");

    expect(found._id.toString()).toBe(user._id.toString());
    expect(found.oauth.google.id).toBe("gid2");
  });

  it("creates new user when not found", async () => {
    const profile = {
      id: "gid3",
      displayName: "New User",
      name: { givenName: "New", familyName: "User" },
      emails: [{ value: "new-oauth@example.com", verified: true }],
    };

    const created = await findOrCreateUser(profile, "google");

    expect(created.email).toBe("new-oauth@example.com");
    expect(created.oauth.google.id).toBe("gid3");
  });
});
