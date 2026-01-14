import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/health" }),
  (req, res) => {
    res.json({ message: "google auth success", profile: req.user });
  }
);

export default router;
