import { Response, Request } from "express";
import mongoose from "mongoose"; // Assuming Mongoose is used
import logger from "../config/logger";

export const healthcareService_DataBase = async (_req: Request, res: Response) => {
  try {
    // Check the database connection status
    const isDbHealthy = mongoose.connection.readyState === 1; // 1 means connected

    if (isDbHealthy) {
      res.status(200).send({ status: "UP", message: "DB connection OK" });
    } else {
      logger.error("Database connection is unhealthy");
      res.status(500).send({ status: "DOWN", error: "Database connection is unhealthy" });
    }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error.message : String(error));
    res.status(500).send({ status: "DOWN", error: "Unknown error occurred" });
  }
};
