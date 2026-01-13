import fs from "fs/promises";
import path from "path";

import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";

import { createUser, loginAndGetTokens } from "./helpers.js";

const fixturePath = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "sample.pdf"
);

describe("Upload API", () => {
  it("uploads a file", async () => {
    const { userRoleId } = globalThis.__roles;
    await createUser({
      email: "upload@example.com",
      password: "Password123!",
      roleId: userRoleId,
    });

    const { accessToken } = await loginAndGetTokens(
      "upload@example.com",
      "Password123!"
    );

    const res = await request(app)
      .post("/api/v1/upload")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", fixturePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.file.filename).toBeTruthy();

    const uploadedPath = path.join(
      process.cwd(),
      "uploads",
      res.body.data.file.filename
    );
    await fs.unlink(uploadedPath);
  });
});
