const express = require("express");
const router = express.Router();

const { asyncErrorHandler, checkMongoError } = require("../middleware");
const projectController = require("../controllers/projectRouter");

router
  .route("/new-project")
  .get(asyncErrorHandler(projectController.indexPage))
  .post(asyncErrorHandler(projectController.postProject));

module.exports = router;
