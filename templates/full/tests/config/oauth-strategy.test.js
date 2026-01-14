import { afterEach, describe, expect, it, vi } from "vitest";

const { useSpy } = vi.hoisted(() => ({
  useSpy: vi.fn(),
}));

vi.mock("passport", () => ({
  default: {
    use: useSpy,
  },
}));

import { configureOAuthStrategy } from "../../src/config/oauth/oauth-utils.js";

const DummyStrategy = class {
  constructor(options, verify) {
    this.options = options;
    this.verify = verify;
  }
};

describe("configureOAuthStrategy", () => {
  afterEach(() => {
    delete process.env.TEST_CLIENT_ID;
    delete process.env.TEST_CLIENT_SECRET;
  });
  it("skips when env missing", () => {
    delete process.env.TEST_CLIENT_ID;
    delete process.env.TEST_CLIENT_SECRET;

    configureOAuthStrategy({
      providerLabel: "Test",
      providerKey: "test",
      Strategy: DummyStrategy,
      clientIdEnv: "TEST_CLIENT_ID",
      clientSecretEnv: "TEST_CLIENT_SECRET",
    });

    expect(useSpy).not.toHaveBeenCalled();
  });

  it("registers strategy when env present", () => {
    process.env.TEST_CLIENT_ID = "id";
    process.env.TEST_CLIENT_SECRET = "secret";

    configureOAuthStrategy({
      providerLabel: "Test",
      providerKey: "test",
      Strategy: DummyStrategy,
      clientIdEnv: "TEST_CLIENT_ID",
      clientSecretEnv: "TEST_CLIENT_SECRET",
    });

    expect(useSpy).toHaveBeenCalled();
  });
});
