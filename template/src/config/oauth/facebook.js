import { Strategy as FacebookStrategy } from "passport-facebook";

import { configureOAuthStrategy } from "./oauth-utils.js";

export const configureFacebookStrategy = () => {
  configureOAuthStrategy({
    providerLabel: "Facebook",
    providerKey: "facebook",
    Strategy: FacebookStrategy,
    clientIdEnv: "FACEBOOK_CLIENT_ID",
    clientSecretEnv: "FACEBOOK_CLIENT_SECRET",
    strategyOptions: {
      profileFields: ["id", "displayName", "name", "emails", "photos"],
    },
  });
};
