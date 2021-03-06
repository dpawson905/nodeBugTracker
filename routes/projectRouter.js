const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  asyncErrorHandler,
  checkUserType,
  isNotAuthenticated,
} = require("../middleware");
const projectController = require("../controllers/projectController");
const bugController = require("../controllers/bugController");
const featureController = require("../controllers/featureController");

router.get("/", asyncErrorHandler(projectController.viewProjects));

router
  .route("/new-project")
  .get(asyncErrorHandler(projectController.indexPage))
  .post(checkUserType, asyncErrorHandler(projectController.postProject));

router.route("/:id").get(asyncErrorHandler(projectController.viewProject));

router
  .route("/:id/bug")
  .post(
    isNotAuthenticated,
    upload.single("image"),
    asyncErrorHandler(bugController.postBug)
  );

router
  .route("/:id/feature")
  .post(
    isNotAuthenticated,
    upload.single("image"),
    asyncErrorHandler(featureController.postFeature)
  );

module.exports = router;
