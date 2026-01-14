import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/api/v1/health" }),
  (req, res) => {
    res.json({ message: "github auth success", profile: req.user });
  }
);

export default router;
