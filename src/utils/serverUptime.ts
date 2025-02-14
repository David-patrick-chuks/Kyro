import { Response, Request } from "express";
import mongoose from "mongoose";

export const getUptime = (): string => {
    const uptimeInSeconds: number = process.uptime();
    const hours: number = Math.floor(uptimeInSeconds / 3600);
    const minutes: number = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds: number = Math.floor(uptimeInSeconds % 60);
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};


export const fullServerStatus = async (_req: Request, res: Response) => {
    const getFormattedTime = () => {
        const now = new Date()
        return now.toLocaleTimeString('en-US', { hour12: true });
    };

    // Check the database connection status
    const isDbHealthy = mongoose.connection.readyState === 1; // 1 means connected

    res.json({
        status: 'OK',
        message: isDbHealthy ? "Database connection is OK" : "Database connection is unhealthy",
        uptime: getUptime(),
        timestamp: getFormattedTime(),
    });
}

export const serverUpTime = async (_req: Request, res: Response) => {

    res.send({ uptime: getUptime() });

}
