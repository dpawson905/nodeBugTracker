const debug = require("debug")("bug-tracker:project");
const User = require("../models/userModel");
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
    /* 
      WE NEED TO IMPLEMENT AN ERROR EMAIL CLASS IN UTILS TO SEND AN ERROR MESSAGE TO THE ADMIN/WEBMASTER
    */
    debug(err);
    req.flash(
      "error",
      "An error has occurred we have been notified and will be looking into is soon."
    );
    return res.redirect("/");
  }
};
