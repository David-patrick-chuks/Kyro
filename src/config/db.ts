import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
const MONGO_URI = "mongodb+srv://askzenai:8W8E5tSP7ih0b5px@askzencluster03.p7egz.mongodb.net/askzen_database4?retryWrites=true&w=majority&appName=AskZenCluster03";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "mydatabase",
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
