import puppeteer from 'puppeteer';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { saveScrapedData } from '../../utils/saveScrapData';

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

    while (linksToVisit.length > 0) {
        const currentLink = linksToVisit.pop();
        if (currentLink && !visitedLinks.has(currentLink)) {
            visitedLinks.add(currentLink);

            const cleanedContent = await scrapeAndCleanContent(currentLink);
            if (cleanedContent) {
                console.log(`Cleaned Content from ${currentLink}:`, cleanedContent);
                await saveScrapedData(currentLink, cleanedContent);
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
}

// Example usage
const baseUrl = 'https://davidtsx.vercel.app';
scrapeAllRoutes(baseUrl)
    .then(() => {
        console.log('Scraping completed.');
    })
    .catch(error => {
        console.error('Error:', error);
    });