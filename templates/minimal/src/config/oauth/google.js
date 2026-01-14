import { Strategy as GoogleOAuth2Strategy } from "passport-google-oauth20";

import { configureOAuthStrategy } from "./oauth-utils.js";

export const configureGoogleStrategy = () => {
  configureOAuthStrategy({
    providerLabel: "Google",
    providerKey: "google",
    Strategy: GoogleOAuth2Strategy,
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
  });
};
