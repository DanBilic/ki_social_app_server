const express = require("express");
const passport = require("passport");

const {
  registerUser,
  redirectUser,
  logoutUser,
  currentUser,
} = require("../controllers/auth");

const router = express.Router();
const protectRoute = require("../middleware/protectRoute");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/callback", passport.authenticate("google"), redirectUser);
router.get("/logout", logoutUser);
router.get("/current_user", currentUser);

module.exports = router;
