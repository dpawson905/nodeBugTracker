const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  replies: {
    type: [String],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);
