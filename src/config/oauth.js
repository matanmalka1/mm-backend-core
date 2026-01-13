import passport from "passport";

import { configureFacebookStrategy } from "./oauth/facebook.js";
import { configureGitHubStrategy } from "./oauth/github.js";
import { configureGoogleStrategy } from "./oauth/google.js";

export { configureGoogleStrategy, configureGitHubStrategy, configureFacebookStrategy };
