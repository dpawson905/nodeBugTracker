const express = require("express");
const router = express.Router();

const { asyncErrorHandler, checkUserType, isNotAuthenticated } = require("../middleware");
const projectController = require("../controllers/projectController");
const bugController = require('../controllers/bugController');
const featureController = require('../controllers/featureController');

router
  .route("/new-project")
  .get(asyncErrorHandler(projectController.indexPage))
  .post(checkUserType, asyncErrorHandler(projectController.postProject));

router.get('/', asyncErrorHandler(projectController.viewProjects));

router.route('/:id')
  .get(asyncErrorHandler(projectController.viewProject));

router.route('/:id/bug')
  .post(isNotAuthenticated, asyncErrorHandler(bugController.postBug));

router.route('/:id/feature')
  .post(isNotAuthenticated, asyncErrorHandler(featureController.postFeature));

module.exports = router;
