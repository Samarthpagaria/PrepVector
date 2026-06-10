import express from "express";
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
/**
 *  @route POST api/auth/register
 * @description Register a new user
 * @access Public
 */
router.route("/register").post(registerUser);

/**
 *  @route POST api/auth/login
 * @description login user with username/email and password
 * @access Public
 */
router.route("/login").post(loginUser);

/**
 *  @route GET api/auth/logout
 * @description clear token rfromfrom user interface and add token in the blacklist
 * @access Public
 */
router.route("/logout").get(logoutUser);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */
router.route("/get-me").get(verifyJWT, getMe);
export default router;
