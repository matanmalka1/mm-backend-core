import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";

import { createUser, loginAndGetTokens } from "./helpers.js";

describe("Users API", () => {
  it("lists users for an authenticated user", async () => {
    const { userRoleId } = globalThis.__roles;
    await createUser({
      email: "list@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const { accessToken } = await loginAndGetTokens(
      "list@example.com",
      "Password123!"
    );

    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });

  it("creates, updates, and deletes a user as admin", async () => {
    const { adminRoleId, userRoleId } = globalThis.__roles;
    await createUser({
      email: "admin@example.com",
      password: "Password123!",
      roleId: adminRoleId,
    });

    const { accessToken } = await loginAndGetTokens(
      "admin@example.com",
      "Password123!"
    );

    const createRes = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        email: "created@example.com",
        password: "Password123!",
        firstName: "Create",
        lastName: "User",
        roleId: userRoleId,
      });

    expect(createRes.statusCode).toBe(201);
    const createdId = createRes.body.data.user._id;

    const updateRes = await request(app)
      .put(`/api/v1/users/${createdId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        firstName: "Updated",
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.user.firstName).toBe("Updated");

    const deleteRes = await request(app)
      .delete(`/api/v1/users/${createdId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteRes.statusCode).toBe(200);
  });

  it("gets a user by id", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await createUser({
      email: "single@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const { accessToken } = await loginAndGetTokens(
      "single@example.com",
      "Password123!"
    );

    const res = await request(app)
      .get(`/api/v1/users/${user._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe("single@example.com");
  });
});
