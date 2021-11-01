const { cloudinary } = require("../cloudinary");
const User = require("../models/userModel");

const middleware = {
  asyncErrorHandler: (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },

  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash("error", "You are currently logged in.");
      return res.redirect("/");
    } else {
      return next();
    }
  },

  isNotAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "You are not authenticated");
      req.session.redirectTo = req.originalUrl;
      return res.redirect("/auth/login");
    }
  },

  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.roles.admin) {
      return next();
    }
    req.flash("error", "You don't have the privileges to do that.");
    return res.redirect("/auth/login");
  },

  deleteProfileImage: async (req) => {
    if (req.file) await cloudinary.uploader.destroy(req.file.filename);
  },

  isVerified: async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return next();
    if (user && !user.isVerified) {
      return next();
    }
    req.flash("error", "Your account is already active.");
    return res.redirect("/");
  },
  
  isNotVerified: async (req, res, next) => {
    let user = await User.findOne({ username: req.body.username });
    if (!user) return next();
    if (user && !user.isVerified) {
      req.flash("error", "Your account is not active.");
      return res.redirect("/");
    }
    return next();
  },

  validatePassword: (req, res, next) => {
    const userInfo = req.body;
    if (userInfo.password !== userInfo.password2) {
      const error = "Sorry, passwords must match.";
      return res.render("auth/register", {
        error,
        userInfo,
        url: "register",
      });
    }
    next();
  }, 

  checkUserType: (req, res, next) => {
    if (req.user.userType === 'creator') return next();
    req.flash('error', 'You do not have permission to do this.');
    return res.redirect('/projects');
  }
};

module.exports = middleware;
