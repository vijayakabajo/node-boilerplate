const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    fullName: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isPlanActive: {
      type: Boolean,
      default: false,
    },
    interviewStatus: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    interviewResult: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plans",
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
    },
    gender: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    firebaseToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports.UserSchema = UserSchema;
module.exports.User = model("User", UserSchema);
