const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const opts = { toJSON: { virtuals: true }, timestamps: true };

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      lowercase: false,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      lowercase: false,
      required: false,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    roles: {
      dev_admin: {
        type: Boolean,
        default: false,
      },
      manager: {
        type: Boolean,
        default: false,
      },
      designer: {
        type: Boolean,
        default: false,
      },
      member: {
        type: Boolean,
        default: true,
      },
    },
    title: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "none",
    },
    image: {
      path: {
        type: String,
        default: "/images/no-user.webp",
      },
      filename: String,
    },
    userSlug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },
    ],
    expiresDateCheck: {
      type: Date,
      default: undefined,
      // if user is not verified then the account will be removed in 24 hours
      expires: 86400,
    },
  },
  opts
);

UserSchema.pre("findOne", function (next) {
  this.populate("projects");
  next();
});

UserSchema.virtual("small").get(function () {
  return this.image.path.replace(
    "/upload",
    "/upload/h_450,w_450,g_auto,c_fill,q_auto"
  );
});
UserSchema.virtual("thumbnail").get(function () {
  return this.image.path.replace(
    "/upload",
    "/upload/h_275,w_275,g_auto,c_fill,q_auto"
  );
});

UserSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  interval: 100,
  // 300000ms is 5 min
  maxInterval: 300000,
  // This will completely lock out an account and requires user intervention.
  maxAttempts: 10,
});

module.exports = mongoose.model("User", UserSchema);
