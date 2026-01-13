import { describe, expect, it, vi } from "vitest";

const { serializeUser, deserializeUser } = vi.hoisted(() => ({
  serializeUser: vi.fn(),
  deserializeUser: vi.fn(),
}));

vi.mock("passport", () => ({
  default: {
    serializeUser,
    deserializeUser,
    use: vi.fn(),
  },
}));

vi.mock("../../src/models/User.js", () => ({
  User: {
    findById: vi.fn(async (id) => ({ _id: id })),
  },
}));

import { User } from "../../src/models/User.js";
import { configureFacebookStrategy, configureGitHubStrategy, configureGoogleStrategy } from "../../src/config/oauth.js";


describe("oauth config", () => {
  it("registers serialize and deserialize handlers", async () => {
    const serializeFn = serializeUser.mock.calls[0][0];
    const deserializeFn = deserializeUser.mock.calls[0][0];

    const doneSerialize = vi.fn();
    serializeFn({ id: "1" }, doneSerialize);
    expect(doneSerialize).toHaveBeenCalledWith(null, "1");

    const doneDeserialize = vi.fn();
    await deserializeFn("1", doneDeserialize);
    expect(User.findById).toHaveBeenCalledWith("1");
    expect(doneDeserialize).toHaveBeenCalledWith(null, { _id: "1" });
  });

  it("exports strategy config functions", () => {
    expect(typeof configureGoogleStrategy).toBe("function");
    expect(typeof configureGitHubStrategy).toBe("function");
    expect(typeof configureFacebookStrategy).toBe("function");
  });
});
