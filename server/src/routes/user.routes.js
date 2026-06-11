import express from "express";
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getUserResumes
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
/**
 *  @route POST api/v1/user/register
 * @description Register a new user
 * @access Public
 */
router.route("/register").post(registerUser);

/**
 *  @route POST api/v1/user/login
 * @description login user with username/email and password
 * @access Public
 */
router.route("/login").post(loginUser);

/**
 *  @route GET api/v1/user/logout
 * @description clear token rfromfrom user interface and add token in the blacklist
 * @access Public
 */
router.route("/logout").get(logoutUser);

/**
 * @route GET /api/v1/user/get-me
 * @description get the current logged in user details
 * @access Private
 */
router.route("/get-me").get(verifyJWT, getMe);

/**
 * @route GET /api/v1/resumes
 * @description get user resumes
 * @access Private
 */
router.route("/resumes").get(verifyJWT, getUserResumes);
export default router;
