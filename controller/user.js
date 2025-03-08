const User = require("../models/user");

module.exports.signupForm = (req, res, next) => {
  try {
    res.render("users/signup.ejs");
  } catch (err) {
    next(err);
  }
};

module.exports.signupUser = async (req, res, next) => {
  let { email, username, password } = req.body;
  try {
    let user = new User({
      email,
      username,
    });
    let registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        "Welcome to Wanderlust! Your account has been created."
      );
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", "Failed to sign up. Please try again.");
    res.redirect("/users/signup");
  }
};

module.exports.loginForm = (req, res, next) => {
  try {
    res.render("users/login.ejs");
  } catch (err) {
    next(err);
  }
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have successfully logged out.");
    res.redirect("/listings");
  });
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  res.redirect("/listings");
};
