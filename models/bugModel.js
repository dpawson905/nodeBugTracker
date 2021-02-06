const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BugSchema = new Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
    images: [{ path: String, filename: String }],
  },
  { timestamps: true }
);

BugSchema.pre(/^find/, function (next) {
  this.populate("_userId");
  next();
});

BugSchema.pre(/^find/, function (next) {
  this.populate({
    path: "Comment",
    options: {
      sort: {
        // Show newest review at the top
        _id: -1,
      },
    },
  });
  next();
});

module.exports = mongoose.model("Bug", BugSchema);
