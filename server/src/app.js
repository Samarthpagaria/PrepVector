import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Require all routes here
import userRouter from "./routes/user.routes.js";
import interviewRouter from "./routes/interview.routes.js";
// Using al the routes here
app.use("/api/auth/", userRouter);
app.use("/api/interview", interviewRouter);



// Error handling middleware
app.use(errorHandler);
export { app };
