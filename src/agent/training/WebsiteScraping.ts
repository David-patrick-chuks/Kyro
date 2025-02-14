import puppeteer from 'puppeteer';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { saveScrapedData } from '../../utils/saveScrapData';
import { generateCleanWebsiteData } from '../script/summarize';
import { trainingSource } from '../data';
import connectDB from '../../config/db';
import { Agent } from '../../dbModels/Agent';

// Function to clean the HTML content
function cleanHTML(inputHtml: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    return purify.sanitize(inputHtml, {
        ALLOWED_TAGS: []  // Remove all tags
    });
}

// Function to scrape and clean content from a given URL using Puppeteer
async function scrapeAndCleanContent(url: string): Promise<string | null> {
    try {
        // Launch a Puppeteer browser instance
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Navigate to the specified URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract the text content from the website
        const htmlContent = await page.evaluate(() => document.body.innerHTML);

        // Close the browser
        await browser.close();

        // Clean the extracted text content
        const cleanedContent = cleanHTML(htmlContent);

        return cleanedContent;
    } catch (error) {
        console.error('Error scraping and cleaning content:', error);
        return null;
    }
}

// Function to get all links from a given URL
async function getAllLinks(url: string): Promise<string[]> {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract all links from the page
        const links = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a')).map(anchor => anchor.href)
        );

        await browser.close();
        return links;
    } catch (error) {
        console.error('Error getting links:', error);
        return [];
    }
}
// Function to scrape and clean content from all routes on a website
async function scrapeAllRoutes(baseUrl: string): Promise<void> {
    const visitedLinks = new Set<string>();
    const linksToVisit = [baseUrl];
    const aggregatedContent: Record<string, string> = {}; // Store scraped content by URL

    while (linksToVisit.length > 0) {
        const currentLink = linksToVisit.pop();
        if (currentLink && !visitedLinks.has(currentLink)) {
            visitedLinks.add(currentLink);

            const cleanedContent = await scrapeAndCleanContent(currentLink);
            if (cleanedContent) {
                console.log(`scrapping=======: ${currentLink}`,);
                await saveScrapedData(currentLink, cleanedContent);
                aggregatedContent[currentLink] = cleanedContent; // Store content by URL
            } else {
                console.log(`Failed to scrape and clean content from ${currentLink}.`);
            }

            const newLinks = await getAllLinks(currentLink);
            for (const link of newLinks) {
                if (link.startsWith(baseUrl) && !visitedLinks.has(link)) {
                    linksToVisit.push(link);
                }
            }
        }
    }

    // Log the entire aggregated content for AI processing
    // console.log("\n======= Aggregated Scraped Content =======\n", JSON.stringify(aggregatedContent, null, 2));
    console.log("\n === DOne scrapping the website =======\n",)
    const data = `\n======= Aggregated Scraped Content =======\n${JSON.stringify(aggregatedContent, null, 2)}`;

    const result = await generateCleanWebsiteData(data);
    console.log("Result from ai after scrapping", result)

    await connectDB()
    // Save parsed data to MongoDB
    
    const agentInstance = new Agent({ WebsiteData: result });
    await agentInstance.save();

}

// Example usage
const baseUrl = trainingSource.websiteUrl;
scrapeAllRoutes(baseUrl)
    .then(() => {
        console.log('Scraping completed.');
    })
    .catch(error => {
        console.error('Error:', error);
    });