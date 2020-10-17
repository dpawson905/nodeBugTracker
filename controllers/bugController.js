const debug = require("debug")("bug-tracker:project");
const Project = require("../models/projectModel");
const Bug = require("../models/bugModel");

exports.postBug = async (req, res, next) => {
  try {
    const newBug = await Bug.create({
      _userId: req.user,
      title: req.body.title,
      description: req.body.description,
    });
    const project = await Project.findById(req.params.id);
    project.bugsTracked.push(newBug);
    await project.save();
    req.flash(
      "success",
      "Thanks for the submission, we will be reviwing this soon."
    );
    return res.redirect("back");
  } catch (err) {
    debug(err);
    req.flash("error", "Something went wrong, please try again later.");
    return res.redirect("back");
  }
};
