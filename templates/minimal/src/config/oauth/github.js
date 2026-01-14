import { Strategy as GitHubOAuth2Strategy } from "passport-github2";

import { configureOAuthStrategy } from "./oauth-utils.js";

export const configureGitHubStrategy = () => {
  configureOAuthStrategy({
    providerLabel: "GitHub",
    providerKey: "github",
    Strategy: GitHubOAuth2Strategy,
    clientIdEnv: "GITHUB_CLIENT_ID",
    clientSecretEnv: "GITHUB_CLIENT_SECRET",
  });
};
