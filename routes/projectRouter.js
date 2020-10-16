const express = require("express");
const router = express.Router();

const { asyncErrorHandler} = require("../middleware");
const projectController = require("../controllers/projectController");

router
  .route("/new-project")
  .get(asyncErrorHandler(projectController.indexPage))
  .post(asyncErrorHandler(projectController.postProject));

router.get('/', asyncErrorHandler(projectController.viewProjects));

router.route('/:id')
  .get(asyncErrorHandler(projectController.viewProject));

module.exports = router;
