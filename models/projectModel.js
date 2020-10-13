const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    projectCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      trim: true,
      required: true,
      lowercase: true
    },
    projectDesc: {
      type: String,
      trim: true,
      required: true
    },
    bugsTracked: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bug",
        required: true,
      },
    ],
    featuresTracked: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feature",
        required: true,
      },
    ],
    testerId: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

ProjectSchema.pre(/^find/, function(next) {
  this.populate('projectCreator');
  next();
});
ProjectSchema.pre(/^find/, function(next) {
  this.populate('testerId');
  next();
});

module.exports = mongoose.model("Project", ProjectSchema);
