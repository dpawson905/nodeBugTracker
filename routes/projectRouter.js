const express = require("express");
const router = express.Router();

const { asyncErrorHandler} = require("../middleware");
const projectController = require("../controllers/projectController");

router.get('/', asyncErrorHandler(projectController.viewProjects));

router.route('/:id')
  .get(asyncErrorHandler(projectController.viewProject));

router
  .route("/new-project")
  .get(asyncErrorHandler(projectController.indexPage))
  .post(asyncErrorHandler(projectController.postProject));

module.exports = router;
