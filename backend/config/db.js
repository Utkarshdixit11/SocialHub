import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// connect to mongodb
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
    // console.log(`MongoDB Connected: ${conn.connection.host}`); // sometimes useful for debugging
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // exit if we can't connect to db
  }
};
