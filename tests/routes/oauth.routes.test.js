import cookieParser from "cookie-parser";
import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

const { authenticateSpy } = vi.hoisted(() => ({
  authenticateSpy: vi.fn((provider) => {
    return (req, res, next) => {
      if (req.path.endsWith("/callback")) {
        req.user = { _id: "1", email: "test@example.com" };
        return next();
      }
      return res.status(200).json({ provider });
    };
  }),
}));

vi.mock("passport", () => ({
  default: {
    authenticate: authenticateSpy,
  },
}));

vi.mock("../../src/services/auth/core.service.js", () => ({
  handleOAuthLogin: vi.fn().mockResolvedValue({
    accessToken: "access",
    refreshToken: "refresh",
  }),
}));

import { router } from "../../src/routes/oauth.routes.js";

describe("oauth routes", () => {
  const app = express();
  app.use(cookieParser());
  app.use("/api/v1/auth", router);

  it("starts OAuth and sets state cookie", async () => {
    const res = await request(app).get("/api/v1/auth/google");
    const cookies = res.headers["set-cookie"] || [];
    const hasState = cookies.some((cookie) => cookie.startsWith("oauthState="));

    expect(authenticateSpy).toHaveBeenCalled();
    expect(hasState).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.body.provider).toBe("google");
  });

  it("rejects callback when state mismatched", async () => {
    const res = await request(app).get("/api/v1/auth/google/callback?state=bad");
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/error=invalid_state/);
  });

  it("completes callback when state matches", async () => {
    const res = await request(app)
      .get("/api/v1/auth/google/callback?state=ok")
      .set("Cookie", "oauthState=ok");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/accessToken=/);
  });
});
