const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BugSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
}, { timestamps: true });

BugSchema.pre(/^find/, function (next) {
  this.populate("_userId");
  next();
});

module.exports = mongoose.model("Bug", BugSchema);
