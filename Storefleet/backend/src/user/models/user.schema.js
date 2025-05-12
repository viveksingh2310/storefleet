import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
    maxLength: [30, "user name can't exceed 30 characters"],
    minLength: [2, "name should have at least 2 characters"],
  },
  email: {
    type: String,
    required: [true, "user email is required"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  profileImg: {
    public_id: {
      type: String,
      required: true,
      default: "1234567890",
    },
    url: {
      type: String,
      required: true,
      default: "this is dummy avatar url",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// JWT Token method
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_Secret, {
    expiresIn: process.env.JWT_Expire,
  });
};

// Password comparison (directly compare strings now)
userSchema.methods.comparePassword = async function (inputPassword) {
  // Warning: Plaintext comparison (use only if hashing is intentionally skipped)
  return inputPassword === this.password;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
