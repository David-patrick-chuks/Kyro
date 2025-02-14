import mongoose from "mongoose";
import { Agent } from "../dbModels/Agent";
import { Tweet } from "../dbModels/Tweet";
import connectDB from "../config/db";

// Function to delete all documents in the database
export const deleteAllData = async () => {
  try {
    connectDB()
    await Agent.deleteMany({});
    await Tweet.deleteMany({});

    console.log("✅ All data from Agent and Tweet collections has been deleted.");
  } catch (error) {
    console.error("❌ Error deleting data:", error);
  }
};

deleteAllData()