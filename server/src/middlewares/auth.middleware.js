import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { BlacklistToken } from "../models/blacklist.models.js";
export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized request", error: error.message });
    }
    const isTokenBlacklisted = await BlacklistToken.findOne({ token });
    if (isTokenBlacklisted) {
      return res
        .status(401)
        .json({ message: "Unauthorized request", error: error.message });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select(
      "-password "
    );
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Token", error: error.message });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
