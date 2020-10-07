exports.indexPage = async (req, res, next) => {
  res.render("projects/newProject", { url: "new-project" });
};
