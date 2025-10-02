import express from "express";
import passport from "passport";

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173/dashboard");
  }
);

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user
router.get("/user", (req, res) => {
  if (req.user) {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
