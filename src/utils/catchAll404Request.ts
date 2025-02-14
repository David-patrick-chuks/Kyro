import { Request, Response } from "express";
import logger from "../config/logger";

export const catchAll404Request =(req: Request, res: Response) => {
    logger.warn(`404 error: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      message: "Not Found",
      error: `Cannot ${req.method} ${req.originalUrl}`,
    });
  }