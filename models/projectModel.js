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
      lowercase: true,
    },
    projectDesc: {
      type: String,
      trim: true,
      required: true,
    },
    projectUrl: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
    bugTags: {
      type: [String],
      lowercase: true,
      trim: true,
    },
    featureTags: {
      type: [String],
      lowercase: true,
      trim: true,
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
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
ProjectSchema.pre(/^find/, function(next) {
  this.populate({
    path: "bugsTracked",
    options: {
      sort: {
        // Show newest review at the top
        _id: -1,
      },
    }
  });
  next();
});
ProjectSchema.pre(/^find/, function(next) {
  this.populate({
    path: "featuresTracked",
    options: {
      sort: {
        // Show newest review at the top
        _id: -1,
      },
    },
  });
  next();
});
// ProjectSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: "comments",
//     options: {
//       sort: {
//         // Show newest review at the top
//         _id: -1,
//       },
//     },
//   });
//   next();
// });

module.exports = mongoose.model("Project", ProjectSchema);
