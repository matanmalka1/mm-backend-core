import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/routes/auth.routes.js", () => ({
  router: express.Router().get("/ping", (_req, res) => res.json({ ok: "auth" })),
}));
vi.mock("../../src/routes/oauth.routes.js", () => ({
  router: express.Router().get("/oauth-ping", (_req, res) =>
    res.json({ ok: "oauth" })
  ),
}));
vi.mock("../../src/routes/user.routes.js", () => ({
  router: express.Router().get("/ping", (_req, res) => res.json({ ok: "users" })),
}));
vi.mock("../../src/routes/upload.routes.js", () => ({
  router: express.Router().get("/ping", (_req, res) => res.json({ ok: "upload" })),
}));
vi.mock("../../src/routes/health.routes.js", () => ({
  router: express.Router().get("/health", (_req, res) => res.json({ ok: true })),
}));

import { router } from "../../src/routes/index.js";

describe("index routes", () => {
  const app = express();
  app.use("/api/v1", router);

  it("mounts auth routes", async () => {
    const res = await request(app).get("/api/v1/auth/ping");
    expect(res.body.ok).toBe("auth");
  });

  it("mounts oauth routes", async () => {
    const res = await request(app).get("/api/v1/auth/oauth-ping");
    expect(res.body.ok).toBe("oauth");
  });

  it("mounts user routes", async () => {
    const res = await request(app).get("/api/v1/users/ping");
    expect(res.body.ok).toBe("users");
  });

  it("mounts upload routes", async () => {
    const res = await request(app).get("/api/v1/upload/ping");
    expect(res.body.ok).toBe("upload");
  });

  it("mounts health routes", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.body.ok).toBe(true);
  });
});
