const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeatureSchema = new Schema(
  {
    _userId: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    comments: [
      {
        type: mongoose.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
    image: {
      path: String,
      filename: String,
    },
  },
  { timestamps: true }
);

FeatureSchema.pre(/^find/, function (next) {
  this.populate("_userId");
  next();
});

FeatureSchema.pre(/^find/, function(next) {
  this.populate({
    path: "Comment",
    strictPopulate: false,
    options: {
      sort: {
        // Show newest review at the top
        _id: -1,
      },
    },
  });
  next();
});
module.exports = mongoose.model("Feature", FeatureSchema);
