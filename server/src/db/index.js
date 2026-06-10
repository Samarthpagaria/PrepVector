import mongoose from "mongoose";
import { DBNAME } from "../constant.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DBNAME}`
    );
    console.log(
      `\n MONGODB CONNECTED SUCCESSFULLY !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error connecting to Db: ", error);
    process.exit(1);
  }
};

export default connectDB;
