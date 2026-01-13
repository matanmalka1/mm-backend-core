import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { User } from "../src/models/User.js";

import { createUser, loginAndGetTokens } from "./helpers.js";

describe("Auth flow", () => {
  it("registers a user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "newuser@example.com",
      password: "Password123!",
      firstName: "New",
      lastName: "User",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("newuser@example.com");
  });

  it("logs in and returns the current user", async () => {
    const { userRoleId } = globalThis.__roles;
    await createUser({
      email: "login@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "login@example.com",
      password: "Password123!",
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.data.accessToken).toBeTruthy();

    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${loginRes.body.data.accessToken}`);

    expect(meRes.statusCode).toBe(200);
    expect(meRes.body.data.user.email).toBe("login@example.com");
  });

  it("refreshes tokens and logs out", async () => {
    const { userRoleId } = globalThis.__roles;
    await createUser({
      email: "refresh@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const { accessToken, refreshCookie } = await loginAndGetTokens(
      "refresh@example.com",
      "Password123!"
    );

    const refreshRes = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", refreshCookie);

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body.data.accessToken).toBeTruthy();
    const rotatedCookie = (refreshRes.headers["set-cookie"] || []).find(
      (cookie) => cookie.startsWith("refreshToken=")
    );
    expect(rotatedCookie).toBeTruthy();

    const reuseRes = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", refreshCookie);
    expect(reuseRes.statusCode).toBe(401);

    const logoutRes = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Cookie", refreshCookie);

    expect(logoutRes.statusCode).toBe(200);
  });

  it("changes password and updates profile", async () => {
    const { userRoleId } = globalThis.__roles;
    const user = await createUser({
      email: "profile@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const { accessToken } = await loginAndGetTokens(
      "profile@example.com",
      "Password123!"
    );

    const changeRes = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "Password123!",
        newPassword: "Password456!",
      });

    expect(changeRes.statusCode).toBe(200);

    const updateRes = await request(app)
      .put("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        firstName: "Updated",
        bio: "Short bio",
        phoneNumber: "+1 555 555 5555",
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.user.firstName).toBe("Updated");

    const updated = await User.findById(user._id).lean();
    expect(updated.firstName).toBe("Updated");
  });
});
