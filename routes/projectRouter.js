const express = require("express");
const router = express.Router();

const projectController = require('../controllers/projectRouter');

router.get('/', projectController.indexPage)

module.exports = router;