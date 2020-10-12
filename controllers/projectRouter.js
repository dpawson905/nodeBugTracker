const debug = require("debug")("bug-tracker:project");
const Email = require("../utils/email");
const emailUrl = require("../utils/urls");
const Project = require("../models/projectModel");

exports.indexPage = async (req, res, next) => {
  res.render("projects/newProject", { url: "new-project" });
};

exports.postProject = async (req, res, next) => {
  try {
    const projExists = await Project.findOne({
      projectName: req.body.projectName,
    });
    if (projExists) {
      req.flash(
        "error",
        `${req.body.projectName} already exists. Please choose a new project name`
      );
      return res.redirect("back");
    }
    const newProject = await Project.create({
      projectName: req.body.projectName,
      projectDesc: req.body.projectDesc,
      projectCreator: req.user,
      testerId: req.user,
    });
    req.flash("success", `${newProject.projectName} has been created`);
    return res.redirect("/");
  } catch (err) {
    const url = emailUrl.setUrl(req, "/projects/", `new-project`);
    await new Email(err, url).sendErrorEmail();
    debug(err);
    req.flash(
      "error",
      "An error has occurred we have been notified and will be looking into it soon."
    );
    return res.redirect("/");
  }
};
