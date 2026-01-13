import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/config/oauth/oauth-utils.js", () => ({
  configureOAuthStrategy: vi.fn(),
}));

import { configureOAuthStrategy } from "../../src/config/oauth/oauth-utils.js";
import { configureGoogleStrategy } from "../../src/config/oauth/google.js";
import { configureGitHubStrategy } from "../../src/config/oauth/github.js";
import { configureFacebookStrategy } from "../../src/config/oauth/facebook.js";

describe("oauth provider config", () => {
  it("calls configureOAuthStrategy for providers", () => {
    configureGoogleStrategy();
    configureGitHubStrategy();
    configureFacebookStrategy();

    expect(configureOAuthStrategy).toHaveBeenCalledTimes(3);
  });
});
