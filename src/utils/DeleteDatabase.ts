import mongoose from "mongoose";
import logger from "../config/logger";

const deleteAllDataExceptAdmin = async (): Promise<void> => {
  try {
    // Ensure the database is connected before proceeding
    if (!mongoose.connection.readyState) {
      throw new Error("Database is not connected.");
    }

    // Wait for the connection to be ready
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database instance is undefined.");
    }

    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;
      const model = mongoose.connection.models[collectionName] || db.collection(collectionName);

      if (collectionName === "users") {
        // Keep only admin users in the "users" collection
        await model.deleteMany({ role: { $ne: "admin" } });
        logger.info(`Deleted all non-admin users from ${collectionName}`);
      } else {
        // Drop all other collections
        await model.deleteMany({});
        logger.info(`Deleted all documents from ${collectionName}`);
      }
    }

    logger.info("Database cleanup completed successfully.");
  } catch (error) {
    logger.error("Error deleting database data:", error);
    throw new Error("Failed to clean database");
  }
};

// Ensure database connection before running the function
mongoose.connection.once("open", async () => {
  logger.info("Connected to database. Running cleanup...");
  await deleteAllDataExceptAdmin();
});
