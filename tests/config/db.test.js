import { describe, expect, it, vi } from "vitest";

vi.mock("mongoose", () => {
  const connection = {
    on: vi.fn(),
    close: vi.fn(),
  };

  return {
    default: {
      connect: vi.fn(async () => ({ connection: { host: "localhost" } })),
      connection,
    },
  };
});

import mongoose from "mongoose";

import { connectDB, disconnectDB } from "../../src/config/db.js";

describe("db config", () => {
  it("connects to mongoose", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";

    const conn = await connectDB();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(conn.connection.host).toBe("localhost");
  });

  it("disconnects from mongoose", async () => {
    await disconnectDB();
    expect(mongoose.connection.close).toHaveBeenCalled();
  });
});
