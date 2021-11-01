const debug = require("debug")("bug-tracker:project");
const Project = require("../models/projectModel");
const Bug = require("../models/bugModel");

const { cloudinary } = require("../cloudinary/");
const { deleteProfileImage } = require("../middleware");
const { image } = require("cloudinary");

exports.postBug = async (req, res, next) => {
  try {
    if (req.file) {
      const { path, filename } = req.file;
      req.body.image = {
        path,
        filename,
      };
    }
    const newBug = new Bug({
      _userId: req.user,
      title: req.body.title,
      description: req.body.description,
      image: req.body.image
    });
    const project = await Project.findById(req.params.id);
    project.bugsTracked.push(newBug);
    await newBug.save();
    await project.save();
    req.flash(
      "success",
      "Thanks for the submission, we will be reviwing this soon."
    );
    return res.redirect("back");
  } catch (err) {
    debug(err);
    await deleteProfileImage(req);
    req.flash("error", "Something went wrong, please try again later.");
    return res.redirect("back");
  }
};
