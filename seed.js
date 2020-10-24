const passport = require("passport");
const faker = require("faker");
const _ = require("lodash");
const User = require("./models/userModel");
const Project = require("./models/projectModel");
const Bug = require("./models/bugModel");
const Feature = require("./models/featureModel");
const Comment = require("./models/commentModel");

const gatherUserInfo = async function () {
  const users = await User.find();
  let userArray = [];
  for (let i of users) {
    userArray.push(i);
  }
  // console.log(userArray[0].username);
  return userArray;
};

const gatherProjectIds = async function () {
  const projects = await Project.find({});
  const projectIds = [];
  for (let i of projects) {
    projectIds.push(i);
  }
  // console.log(projectIds);
  return projectIds;
};

const gatherBugData = async function () {
  const bugs = await Bug.find({});
  const bugsArray = [];
  for (let i of bugs) {
    bugsArray.push(i);
  }
  // console.log(projectIds);
  return bugsArray;
};

const gatherFeatureData = async function () {
  const features = await Feature.find({});
  const featuresArray = [];
  for (let i of features) {
    featuresArray.push(i);
  }
  // console.log(projectIds);
  return featuresArray;
};

exports.seedUsers = async function () {
  await User.deleteMany({});
  for (const i of new Array(10)) {
    let email = faker.internet.email();
    let username = faker.internet.userName();
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let isVerified = true;
    let userType = "tester";
    let expiresDateCheck = undefined;
    let password = "password";
    let user = {
      email,
      username,
      firstName,
      lastName,
      isVerified,
      userType,
      expiresDateCheck,
      password,
    };
    await User.register(user, user.password);
  }
  console.log("10 new users created");
};

exports.seedProjects = async function () {
  await Project.deleteMany({});
  let userArray = await gatherUserInfo();
  for (const i of new Array(50)) {
    let projectUserInfo = _.shuffle(userArray)[0];
    let projectCreator = projectUserInfo.id;
    let projectName = faker.lorem.words();
    let projectDesc = faker.lorem.paragraph();
    let projectUrl = faker.internet.domainName();
    let testerId = userArray;
    let newProject = await Project.create({
      projectCreator,
      projectName,
      projectDesc,
      projectUrl,
      testerId,
    });
    projectUserInfo.projects.push(newProject);
    await projectUserInfo.save();
  }
  console.log("50 new projects created");
};

exports.seedBugs = async function () {
  await Bug.deleteMany({});
  const users = await gatherUserInfo();
  const projects = await gatherProjectIds();
  for (const i of new Array(25)) {
    let userInfo = _.shuffle(users)[0];
    let project = _.shuffle(projects)[0];
    let _userId = userInfo.id;
    let title = faker.lorem.words();
    let description = faker.lorem.paragraph();
    let newBug = await Bug.create({
      _userId,
      title,
      description,
    });
    project.bugsTracked.push(newBug);
    await project.save();
  }
  console.log("25 new bugs created");
};

exports.seedFeatures = async function () {
  await Feature.deleteMany({});
  const users = await gatherUserInfo();
  const projects = await gatherProjectIds();
  for (const i of new Array(25)) {
    let userInfo = _.shuffle(users)[0];
    let project = _.shuffle(projects)[0];
    let _userId = userInfo.id;
    let title = faker.lorem.words();
    let description = faker.lorem.paragraph();
    let newFeature = await Feature.create({
      _userId,
      title,
      description,
    });
    project.featuresTracked.push(newFeature);
    await project.save();
  }
  console.log("25 new features created");
};

exports.seedBugComments = async function () {
  await Comment.deleteMany({});
  const users = await gatherUserInfo();
  const bugs = await gatherBugData();
  for (const i of new Array(30)) {
    let userInfo = _.shuffle(users)[0];
    let bug = _.shuffle(bugs)[0];
    let _userId = userInfo.id;
    let comment = faker.lorem.paragraph();
    let newComment = await Comment.create({
      _userId,
      comment,
    });
    bug.comments.push(newComment);
    await bug.save();
  }
  console.log("30 new bug comments made");
};

exports.seedFeatureComments = async function () {
  // await Comment.deleteMany({});
  const users = await gatherUserInfo();
  const features = await gatherFeatureData();
  for (const i of new Array(30)) {
    let userInfo = _.shuffle(users)[0];
    let feature = _.shuffle(features)[0];
    let _userId = userInfo.id;
    let comment = faker.lorem.paragraph();
    let newComment = await Comment.create({
      _userId,
      comment,
    });
    feature.comments.push(newComment);
    await feature.save();
  }
  console.log("30 new feature comments made");
};
