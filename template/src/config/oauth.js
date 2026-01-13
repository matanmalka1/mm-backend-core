import passport from "passport";

import { User } from "../models/User.js";

import { configureFacebookStrategy } from "./oauth/facebook.js";
import { configureGitHubStrategy } from "./oauth/github.js";
import { configureGoogleStrategy } from "./oauth/google.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export { configureGoogleStrategy, configureGitHubStrategy, configureFacebookStrategy };
