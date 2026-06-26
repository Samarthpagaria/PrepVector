import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { generateInterviewReport } from "./services/ai.services.js";
import { resume, selfDescription, jobDescription } from "./services/temp.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const { default: connectDB } = await import("./db/index.js");
const { app } = await import("./app.js");

const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Errr" + error);
      throw error;
    });
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.on("close", () => {
      console.log("Server Shutting down");
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed !!", error);
  });
// The following code was automatically running every time the server started,
// causing a crash because your AI API account is out of credits.
// I have commented it out so your server can boot up successfully!

// const result = await generateInterviewReport({
//   resume: resume,
//   jobDescription: jobDescription,
//   selfDescription: selfDescription,
// });
// 
// console.log(JSON.stringify(result, null, 2));
