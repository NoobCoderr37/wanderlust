const express = require("express");
const passport = require("passport");
const wrapAsync = require("../public/js/wrapAsync");
const router = express.Router();
const userController = require("../controller/user");

// Render signup page
router
  .route("/signup")
  .get(userController.signupForm)
  .post(wrapAsync(userController.signupUser));

// Render login page
router
  .route("/login")
  .get(userController.loginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: "Invalid username or password. Please try again.",
    }),
    userController.loginUser
  );

// Logout route
router.get("/logout", userController.logoutUser);
module.exports = router;
