import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL Not Found");
  if (isConnected) return console.log("Already Connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};
