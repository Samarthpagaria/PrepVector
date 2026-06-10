import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "The username is already taken."],
    },
    email: {
      type: String,
      unique: [true, "Account already exist."],
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", userSchema);
