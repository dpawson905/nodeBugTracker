const debug = require("debug")("bug-tracker:project");
const Email = require("../utils/email");
const emailUrl = require("../utils/urls");
const Project = require("../models/projectModel");

exports.indexPage = async (req, res, next) => {
  res.render("projects/newProject", { url: "new-project" });
};

exports.viewProjects = async (req, res, next) => {
  const userProjects = await Project.find({ projectCreator: req.user });
  res.render('projects/showProjects', { userProjects, url: 'projects' });
}

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
      projectCreator: req.user.id,
      testerId: req.user.id,
    });
    req.flash("success", `${newProject.projectName} has been created`);
    return res.redirect("/");
  } catch (err) {
    let url = ''
    let message = err;
    await new Email(req.user, url, message).sendErrorEmail();
    debug(err);
    req.flash(
      "error",
      "An error has occurred we have been notified and will be looking into it soon."
    );
    return res.redirect("/");
  }
};
