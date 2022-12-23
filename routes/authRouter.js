const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {
  asyncErrorHandler,
  isNotAuthenticated,
  isAuthenticated,
  isNotVerified,
} = require("../middleware/index");

router
  .route("/login")
  .get(isAuthenticated, authController.getLogin)
  .post(
    isAuthenticated,
    asyncErrorHandler(isNotVerified),
    asyncErrorHandler(authController.postLogin)
  );

router.get("/logout", isNotAuthenticated, authController.logOut);

module.exports = router;
