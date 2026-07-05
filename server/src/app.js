import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import mongoose from "mongoose";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://prepvector.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean),
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
import resumeRouter from "./routes/resume.routes.js";
import aiRouter from "./routes/ai.routes.js";

// Using al the routes here
app.use("/api/v1/user", userRouter);
app.use("/api/v1/interview", interviewRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/ai", aiRouter);



// Health route for cron jobs
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  if (dbStatus === 'connected') {
    return res.status(200).json({
      status: "success",
      message: "Backend is running and healthy",
      db: dbStatus,
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(503).json({
      status: "error",
      message: "Backend is running but database is not connected",
      db: dbStatus,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use(errorHandler);
export { app };
