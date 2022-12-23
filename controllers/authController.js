const passport = require("passport");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", { url: "login" });
};

exports.postLogin = async (req, res, next) => {
  await passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/",
    successFlash: `Welcome back ${req.body.username}`,
    failureFlash: true,
  })(req, res, next);
};

exports.logOut = (req, res, next) => {
  req.logout();
  return res.redirect("/");
};
