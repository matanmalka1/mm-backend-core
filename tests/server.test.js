import { describe, expect, it, vi } from "vitest";

const listenMock = vi.fn((port, cb) => {
  if (cb) cb();
  return { close: vi.fn((done) => done()) };
});

vi.mock("../src/app.js", () => ({
  app: {
    listen: listenMock,
  },
}));
vi.mock("../src/config/db.js", () => ({
  connectDB: vi.fn(async () => {}),
  disconnectDB: vi.fn(async () => {}),
}));
vi.mock("../src/utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { connectDB } from "../src/config/db.js";


describe("server", () => {
  it("starts server on import", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});

    await import("../src/server.js");

    expect(connectDB).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalled();

    exitSpy.mockRestore();
  });
});
