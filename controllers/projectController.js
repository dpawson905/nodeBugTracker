const debug = require("debug")("bug-tracker:project");
const Project = require("../models/projectModel");

exports.indexPage = async (req, res, next) => {
  res.render("projects/newProject", { url: "new-project" });
};

exports.viewProjects = async (req, res, next) => {
  const userProjects = await Project.find({ projectCreator: req.user });
  res.render('projects/showProjects', { userProjects, url: 'projects' });
};

exports.viewProject = async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  console.log(project)
  res.render('projects/showProject', { project });
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
      projectUrl: req.body.projectUrl,
      projectCreator: req.user.id,
      testerId: req.user.id,
    });
    const user = req.user;
    user.projects.push(newProject);
    await user.save();
    req.flash("success", `${newProject.projectName} has been created`);
    return res.redirect("/projects");
  } catch (err) {
    // Need to create a new class(maybe) that will email an admin the error...
    debug(err);
    req.flash(
      "error",
      "An error has occurred we have been notified and will be looking into it soon."
    );
    return res.redirect("/");
  }
};
