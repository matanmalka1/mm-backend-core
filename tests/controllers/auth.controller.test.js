import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/auth/core.service.js", () => ({
  register: vi.fn(),
  login: vi.fn(),
}));
vi.mock("../../src/services/auth/password.service.js", () => ({
  changePassword: vi.fn(),
}));
vi.mock("../../src/services/auth/profile.service.js", () => ({
  updateProfile: vi.fn(),
}));
vi.mock("../../src/services/auth/token.service.js", () => ({
  logout: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

import {
  register,
  login,
  logout,
  refresh,
  me,
  changePassword,
  updateProfile,
} from "../../src/controllers/auth.controller.js";
import * as coreService from "../../src/services/auth/core.service.js";
import * as tokenService from "../../src/services/auth/token.service.js";
import * as passwordService from "../../src/services/auth/password.service.js";
import * as profileService from "../../src/services/auth/profile.service.js";

const buildRes = () => {
  const res = {
    statusCode: 200,
    payload: null,
    cookies: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
    cookie(name, value) {
      this.cookies[name] = value;
      return this;
    },
    clearCookie(name) {
      this.cookies[name] = null;
      return this;
    },
  };
  return res;
};

describe("auth controller", () => {
  it("registers a user", async () => {
    coreService.register.mockResolvedValue({ user: { id: "1" } });
    const req = { body: { email: "a@b.com" } };
    const res = buildRes();

    await register(req, res);

    expect(res.payload.message).toBe("Check your email");
  });

  it("logs in and sets refresh token cookie", async () => {
    coreService.login.mockResolvedValue({
      user: { id: "1" },
      accessToken: "access",
      refreshToken: "refresh",
    });

    const req = { body: { email: "a@b.com", password: "x" } };
    const res = buildRes();

    await login(req, res);

    expect(res.cookies.refreshToken).toBe("refresh");
    expect(res.payload.data.accessToken).toBe("access");
  });

  it("refreshes access token", async () => {
    tokenService.refreshAccessToken.mockResolvedValue({
      accessToken: "access",
      refreshToken: "refresh2",
    });

    const req = { cookies: { refreshToken: "refresh1" } };
    const res = buildRes();

    await refresh(req, res);

    expect(res.cookies.refreshToken).toBe("refresh2");
  });

  it("logs out and clears cookie", async () => {
    tokenService.logout.mockResolvedValue();

    const req = { user: { id: "1" }, cookies: { refreshToken: "token" } };
    const res = buildRes();

    await logout(req, res);

    expect(res.cookies.refreshToken).toBeNull();
  });

  it("returns current user", async () => {
    const req = { user: { id: "1" } };
    const res = buildRes();

    await me(req, res);

    expect(res.payload.data.user.id).toBe("1");
  });

  it("changes password", async () => {
    passwordService.changePassword.mockResolvedValue();

    const req = {
      user: { id: "1" },
      body: { currentPassword: "a", newPassword: "b" },
    };
    const res = buildRes();

    await changePassword(req, res);

    expect(res.payload.message).toMatch(/Password changed/);
  });

  it("updates profile", async () => {
    profileService.updateProfile.mockResolvedValue({ id: "1" });

    const req = { user: { id: "1" }, body: { firstName: "New" } };
    const res = buildRes();

    await updateProfile(req, res);

    expect(res.payload.data.user.id).toBe("1");
  });
});
