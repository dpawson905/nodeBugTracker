const debug = require("debug")("bug-tracker:app");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongo");
const csrf = require("csurf");
const expressSanitizer = require("express-sanitizer");

const logs = require("./utils/logs");

const errLogger = require("./utils/logs");
// errLogger.errorLog();

// const seed = require('./seed');
// seed
//   .seedUsers()
//   .then(() => seed.createAdmin())
//   .then(() => seed.seedProjects())
//   .then(() => seed.seedBugs())
//   .then(() => seed.seedFeatures())
//   .then(() => seed.seedBugComments())
//   .then(() => seed.seedFeatureComments());

const User = require("./models/userModel");

const authRouter = require("./routes/authRouter");
const indexRouter = require("./routes/indexRouter");
const projectRouter = require("./routes/projectRouter");
const usersRouter = require("./routes/userRouter");

const csrfProtection = csrf({ cookie: true });

const app = express();

app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set security HTTP headers
const scriptSrcUrls = [
  "https://*.fontawesome.com/",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com"
];
const styleSrcUrls = [
  "https://*.fontawesome.com/",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com"
];
const connectSrcUrls = [
  "https://*.fontawesome.com/",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com"
];
const frameSrcUrls = [
  "https://*.fontawesome.com/",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com"
];
const fontSrcUrls = [
  "https://*.fontawesome.com/",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com"
];
const imgUrls = ["https://res.cloudinary.com/", "https://cdn.fakercloud.com"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      frameSrc: ["'self'", ...frameSrcUrls],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      imgSrc: ["'self'", "blob:", "data:", ...imgUrls],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Development logging
if (process.env.NODE_ENV.trim() === "development") {
  app.use(logger("common"));
}
app.use(methodOverride("_method"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));

app.locals.moment = require("moment");

const sess = {
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    expires: Date.now() + (1000 * 60 * 60) / 1,
    maxAge: (1000 * 60 * 60) / 1,
  },
  store: MongoDBStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 24 * 3600,
    crypto: {
      secret: "bearer" + process.env.COOKIE_SECRET,
    },
  }),
  resave: true,
  saveUninitialized: false,
};

if (app.get("env") === "production") {
  app.set("trust proxy", true); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(flash());
app.use(session(sess));
app.use(csrfProtection);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.title = "Bug Tracker";
  res.locals.csrfToken = req.csrfToken();
  res.locals.token = req.query.token;
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});
app.locals.url = "home";

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
