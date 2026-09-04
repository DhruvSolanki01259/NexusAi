import { loadEnv } from "@/utils/loadEnv";
import mongoose from "mongoose";

const { MongoUrl } = loadEnv;
if (!MongoUrl) {
  throw new Error(`MongoDB Url is not configured in .env file.`);
}

export const connectToMongoDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log(
      `[MONGODB CONNECTION WARNING]: Already Connected to MongoDB Database.`,
    );
    return;
  }

  if (connectionState === 2) {
    console.log(
      `[MONGODB CONNECTION WARNING]: Connecting to MongoDB Database...`,
    );
    return;
  }

  try {
    await mongoose.connect(MongoUrl, {
      dbName: "NexusAI",
      bufferCommands: true,
    });
    console.log(
      `[MONGODB CONNECTION SUCCESS]: Connected to MongoDB Database Successfully.`,
    );
  } catch (error) {
    console.error(
      `[MONGODB CONNECTION ERROR] - Error Connecting to MONGODB Database: ${error}`,
    );
    return;
  }
};
