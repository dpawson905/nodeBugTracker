const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

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
      lowercase: true,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      required: true,
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
      admin: {
        type: Boolean,
        default: false,
      },
      manager: {
        type: Boolean,
        default: false,
      },
      basic: {
        type: Boolean,
        default: true,
      },
    },
    userType: {
      type: String,
      required: [true, 'Please seclect a role in the form.'],
      trim: true,
      lowercase: true
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },
    ],
    image: {
      secure_url: { type: String, default: "/images/no-user.jpg" },
      public_id: String,
    },
    expiresDateCheck: {
      type: Date,
      default: undefined,
      // if user is not verified then the account will be removed in 24 hours
      expires: 86400,
    },
  },
  { timestamps: true }
);

UserSchema.pre('findOne', function (next) {
  this.populate('projects');
  next();
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
