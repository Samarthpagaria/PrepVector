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
        .json({ message: "Unauthorized request" });
    }
    const isTokenBlacklisted = await BlacklistToken.findOne({ token });
    if (isTokenBlacklisted) {
      return res
        .status(401)
        .json({ message: "Unauthorized request (Blacklisted)" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select(
      "-password "
    );
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Token (User not found)" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    console.error("Auth Middleware Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
