import { promises as fs } from "fs";
import path from "path";
import logger from "../config/logger";




/// Function to save scraped data to scrapedData.json
export const saveScrapedData = async function (link: string, content: string): Promise<void> {
    const scrapedDataPath = path.join(__dirname, '../data/scrapedData.json');
    const scrapedDataDir = path.dirname(scrapedDataPath);
    const scrapedData = {
        link,
        content,
    };

    try {
        // Ensure the directory exists
        await fs.mkdir(scrapedDataDir, { recursive: true });

        // Check if the file exists
        await fs.access(scrapedDataPath);
        // Read the existing data
        const data = await fs.readFile(scrapedDataPath, 'utf-8');
        const json = JSON.parse(data);
        // Append the new scraped data
        json.push(scrapedData);
        // Write the updated data back to the file
        await fs.writeFile(scrapedDataPath, JSON.stringify(json, null, 2));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // File does not exist, create it with the new scraped data
            await fs.writeFile(scrapedDataPath, JSON.stringify([scrapedData], null, 2));
        } else {
            logger.error('Error saving scraped data:', error);
            throw error;
        }
    }
};