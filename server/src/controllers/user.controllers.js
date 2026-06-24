import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklist.models.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Resume from "../models/resume.models.js";

/**
 * @name registerUserController
 * @description register a new user ,expects username,email,and password
 * @access Public
 * @path /api/v1/users/register
 * @method POST
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username, email and password.",
    });
  }

  const isUserAlreadyExist = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "Account already exist with this email address or username.Please try login.",
    });
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hash,
  });

  // Generate token
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const createdUser = await User.findById(user._id).select(
    "-password"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res.cookie("token", token, options).status(201).json({
    message: "User registered successfully",
    user: createdUser,
  });
});

/**
 * @name loginUserController
 * @description login a user, expects email and password  in the req.body
 * @access Public
 * @path /api/v1/users/login
 * @method POST
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    return res.status(400).json({
      message: "Please provide email or username.",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required.",
    });
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found with the given credentials.",
    });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid credentials.",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res.cookie("token", token, options).status(200).json({
    message: "User logged in successfully",
    user: loggedInUser,
  });
});

/**
 * @name logoutUserController
 * @description logout a user,accepts token in cookies
 * @access Private
 * @path /api/v1/users/logout
 * @method POST
 */
const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    await BlacklistToken.create({ token });
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({
    message: "User logged out successfully",
  });
});

/**
 * @name getMeController
 * @description get current user details
 * @access Private
 * @path /api/v1/users/me
 * @method GET
 */
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "User fetched successfully",
    user: req.user,
  });
});

/**
 * @name getUserResumes
 * @description controller for getting user resumes
 * @access Private
 * @path /api/v1/user/resumes
 * @method GET
 */

const getUserResumes = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const resumes = await Resume.find({ owner: userId });
  return res.status(200).json({
    message: "User resumes fetched successfully",
    resumes,
  });
});
export { registerUser, loginUser, logoutUser, getMe, getUserResumes };
