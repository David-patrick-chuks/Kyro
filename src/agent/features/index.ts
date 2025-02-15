import { IgApiClient } from 'instagram-private-api';
import { get } from 'request-promise';
import { download } from '../../utils';
import moment from "moment";
import mongoose from "mongoose";

import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { ITweet, Tweet } from '../../dbModels/Tweet';
/* eslint-disable no-unused-vars */
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import logger from '../../config/logger';
import { Agent, IAgent } from '../../dbModels/Agent';
import connectDB from '../../config/db';
import { searchImage } from '../browse';

// Load environment variables
dotenv.config();

const client = new TwitterApi({
    appKey: "OibJ19NXxc1YkD7NvuxQ44jgY",
    appSecret: "KIJohr6mBUd8OyYb1CtsIZGV2m0V5Q5TxQ5Q2r4RYlBRKYI1IS",
    accessToken: "1879281425029214208-Yd2LLl1MDMJrnUJ8IZTylDakSOuJdK",
    accessSecret: "v9cBcjzezk2hJstdggYxXVbqivqBk8GJaT6emWNEVdTMw",
});

const bearer = new TwitterApi("AAAAAAAAAAAAAAAAAAAAADmxyAEAAAAAlJ%2BrDDxBKBxf8gLwJTjwwT8LlhQ%3D8lKQpNp2Bf6XY9b2JDlCclnAUAV9ky7jqXndt0uCrS2a2SjFN4");

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

async function canSendTweet() {
    const twentyFourHoursAgo = moment().subtract(24, "hours").toDate(); // Get the timestamp of 24 hours ago

    // Check how many tweets were sent in the last 24 hours
    const tweetCount = await Tweet.countDocuments({
        timeTweeted: { $gte: twentyFourHoursAgo }, // Tweets sent within the last 24 hours
    });

    if (tweetCount >= 17) {
        console.log("Rate limit reached for the last 24 hours. Cannot send tweet.");
        return false; // Exceeded tweet limit for the last 24 hours
    }

    console.log(
        `Tweets sent in the last 24 hours: ${tweetCount}. You can send another tweet.`
    );
    return true; // Can send tweet
}

export const postToInsta = async (imageUrl: string, caption: string): Promise<void> => {
    console.log("----Uploading Post to Instagram----");
    const ig = new IgApiClient();
    ig.state.generateDevice("Kyro");

    try {
        await ig.account.login("agentkyro", "Chuks#chuks5686");

        const imageBuffer = await get({
            url: imageUrl,
            encoding: null,
        });

        await ig.publish.photo({
            file: imageBuffer,
            caption: caption,
        });

        console.log("Instagram post uploaded successfully! ✅");
    } catch (error) {
        console.error("Error posting to Instagram:", error);
    }
};





const postToTwitter = async (imageUrl: string, caption: string): Promise<void> => {

    const canSend = await canSendTweet();
    
    if (!canSend) return; // If we cannot send tweet, exit the function
    console.log("----Uploading Post to Twiter----");
    const uri = imageUrl;
    const filename = "image.png";

    download(uri, filename, async function () {
        try {
            const mediaId = await twitterClient.v1.uploadMedia("./image.png");
            const send = await twitterClient.v2.tweet({
                text: caption,
                media: {
                    media_ids: [mediaId]
                }
            });
            // Store tweet data in the database
            const newTweet = new Tweet({
                tweetContent: caption,
                imageUrl: uri,
                timeTweeted: new Date(),
            });

            await newTweet.save();
            console.log("Twitter post uploaded successfully! ✅");
            // console.log("Tweeted: ", caption);
            // console.log("Tweeted Data: ", send);
        } catch (e) {
            console.log(e)
        }
    });


}







const geminiApiKeys = [

    "AIzaSyATWBaufybCmja_dcpn8qMz5B6dw1DKuKk",
    "AIzaSyDouDNZZtHXlF2lgz9QqCnc-vLbz5v71Kk",
    "AIzaSyBhwCvQDSG-IF1cIWfwh05Lu-FlvJXqkRc",
    "AIzaSyCBxpd6hbxvrFfTX1lOv91nFD6-7z9nXtE",
    "AIzaSyAGq8jCCKcSyuNYX-FqrWinsvUNqv4Bey4",
    "AIzaSyA0H0rBD3zWviEo5kilQ8EE2b6u0vIXtIo",
    "AIzaSyA5_ODpSN7twkfTqLzrMPO5OOmI4A7WsQc",
    "AIzaSyDfDWTjSdTxYXKriQD7eppLscJ_oXWiXk0",
    "AIzaSyA3M8tl5BXMhRbNF7I8fTDQmIQ_oo_IeNw",
    "AIzaSyC2HLk9_WJtMTbEQxCpRSGOGPkXFVPZ35g",
    "AIzaSyBwNCakKQ6wc7pg3q4PxiBhq_rCfZOb2UU",
    "AIzaSyBsiPPnjvrDhut2DMTkQ6wxeHSPfyBEihk",
    "AIzaSyAQ1rZygvFT8NzPhAO6qxa-dtaMEHqZP64",
    "AIzaSyDOuzfEaU37K19tOtv5cjokC1pBs2lZLCQ",
    "AIzaSyA81tzxjDxVnjjZq8Op8D5AQm3-ckXA0cg",
    "AIzaSyB5Hu2ZLAqsEfiZuQi94RhIbCe1KcOj4DM",
    "AIzaSyDMiBX1S2gQVxUFT85rnMrVNruWmBKwlTk",
    "AIzaSyC1lPUfpiJnsbDL2CdAa5zZb9CL4tgvK80",
    "AIzaSyArInw0_5TGUcVuO0LKmNQLy10lCW49okM",
    "AIzaSyBJTwgOwvmu7w_rXcvY5or7ZI2vvou70cA",
    "AIzaSyDmYhOZLV4hd0apv6ZM1R3NS7LWmTpp_s4",
    "AIzaSyApO0edRaTwI2JWkhsZq_SPyPQ-q5OeE4o",
    "AIzaSyCpdaWdiYW2__6cRywmzkH6Kwr0TpgjP_E",
    "AIzaSyCuR1HxXWSXgoY_Nlw6OWMLEaOGDj7YRF8",
    "AIzaSyDgSGUAH569RjrmYjz-QUsDMqjITiHS7OA",
    "AIzaSyDNJ-IRsFQumvGEi044P_J8zPs3wIU367o",
    "AIzaSyBz6jaMp4Z5304Knx9UiJdX8DQjw1lqg9g",
    "AIzaSyBHVdQ5gjbWiYrxUNE_wbNTZ_aUGPjWqwI",
    "AIzaSyDNa1rY4QAiVwzj_1LcGPPFAetEfVa7zr0",
    "AIzaSyA9Df2q2kOR9MZkrCimGjgUVAKuz1kyZPg",
    "AIzaSyDAwMfnUqo7REPxSkLVOCo9OTeaEHAf43E",
    "AIzaSyAv4K3hVofefPm1d5mt4Y39NQVXNQ49Dbg",
    "AIzaSyB1YZPMxgYzLdhyWOoLQoi6Akv_AVZQihs",
    "AIzaSyDV9XzIcYhYw9uqNrWZNfI25GT3iFlGy3A",
    "AIzaSyAIcaMSaIPnbsulIMi7WJSrx95tiwyyjIo",
    "AIzaSyDi4JRtfBP0NEXXWLT40rYTD5-_bIBIogQ",
    "AIzaSyADgAkDx5jvf8kmyk9NqcKSQtSNqeG62qA",
    "AIzaSyDYeeex41Ssr409I1sx04Jxk3xlb-z1O5M",
    "AIzaSyAF8TSVWvVTv62X-bmeHTXv21KBDgcYDVE",
    "AIzaSyBUACYkd6ZGP2madg6weu5Twbrb8LtsjKQ",
    "AIzaSyB6yhfVxwbEAwXcgoApKTJPeutdjH_yWH4",
    "AIzaSyAwePV5GXjqn2IrHs9rWlZHGeei4LvXrSo",
    "AIzaSyBUHKun0ofNXC4c57lWM7VwVA5627BdCsI",
    "AIzaSyCCMWWDVJq83MCTtt4za1LMk3rPtEyO2DE",
];


let currentApiKeyIndex = 0; // Keeps track of the current API key in use

// Function to get the next API key in the list
const getNextApiKey = () => {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length; // Circular rotation of API keys
    return geminiApiKeys[currentApiKeyIndex];
};

interface GeneratedPost {
    viraRate: string,
    postImageQuery: string,
    postContent: string,
}

const getPostDataSchema = () => {
    return {
        description: `Schema for posting after viewing the JSON DATA for a user persona`,
        type: SchemaType.ARRAY,
        items: {
            type: SchemaType.OBJECT,
            properties: {
                postContent: {
                    type: SchemaType.STRING,
                    description: 'A post between 100 and 250 characters long. do not add hashtags',
                    nullable: false,
                },
                viraRate: {
                    type: SchemaType.NUMBER,
                    description: 'The viral rate, meaning the rate of the content to go viral when posted, measured on a scale of 0 to 100.',
                    nullable: false,
                },
                postImageQuery: {
                    type: SchemaType.STRING,
                    description: 'A precise image search query to fetch a exact image that matches the post via the Google Custom Search API',
                    nullable: true,
                },
            },
            required: ['postContent', 'viraRate', 'postImageQuery'],
        },
    }
}
export async function generatePostContent(userPersona: string, previousPosts: string): Promise<any | string> {
    let geminiApiKey = geminiApiKeys[currentApiKeyIndex];
    let currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`;

    if (!geminiApiKey) {
        logger.error("No Gemini API key available.");
        return "No API key available.";
    }

    const schema = await getPostDataSchema();

    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema,
    };

    const googleAI = new GoogleGenerativeAI(geminiApiKey);
    const model = googleAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig,
    });


    const MainPrompt = `You are an AI agent that processes scapped data JSON data. Your task is to thoroughly analyze the following JSON input,then Use these details to generate a **new, unique, and engaging** social media post that accurately reflects the user's personality and expertise. 

    **Rules:**
    1. The post **must be different** from any previous posts. **Do not generate any content that resembles or repeats past posts.**
    2. The style should match the given attributes but should present **fresh insights, wording, and perspectives.**
    3. Avoid direct repetition of themes or phrases from the examples below.
    4. Prioritize originality while maintaining the user’s tone and message.
    
    Here is the scrap data JSON data: 
    
    ${JSON.stringify(userPersona, null, 2)} 
    
    **These are previous posts—do NOT generate anything similar to them:** 
    
    ${JSON.stringify(previousPosts, null, 2)}
    `;
    try {
        const result = await model.generateContent(MainPrompt);

        if (!result || !result.response) {
            logger.info("No response received from the AI model. || Service Unavailable");
            return "Service unavailable!";
        }

        const responseText = result.response.text();
        const post = JSON.parse(responseText);
        if (!post) {
            logger.error("Invalid JSON response from the AI model.");
            return "Invalid JSON response.";
        }
        const data = post[0]

        return data;

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("429 Too Many Requests")) {
                logger.error(`---${currentApiKeyName} limit exhausted, switching to the next API key...`);
                geminiApiKey = getNextApiKey();
                currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`;
                return generatePostContent(userPersona, previousPosts);
            } else if (error.message.includes("503 Service Unavailable")) {
                logger.error("Service is temporarily unavailable. Retrying...");
                await new Promise(resolve => setTimeout(resolve, 5000));
                return generatePostContent(userPersona, previousPosts);
            } else {
                logger.error("Error generating training prompt:", error.message);
                return `An error occurred: ${error.message}`;
            }
        } else {
            logger.error("An unknown error occurred:", error);
            return "An unknown error occurred.";
        }
    }
}






// Function to fetch all scraped data from the Agent collection
const getScrapedData = async (): Promise<string> => {
    const agents: IAgent[] = await Agent.find();
    if (!agents.length) return ""; // Return empty string if no documents

    return agents
        .map(
            (agent) =>
                `Text: ${agent.TextData || ""}, Website: ${agent.WebsiteData || ""}, Audio: ${agent.AudioData || ""}, YouTube: ${agent.YoutubeData || ""}`
        )
        .join("\n");
};

// Function to fetch all previous tweets
const getPreviousPosts = async (): Promise<string> => {
    const tweets: ITweet[] = await Tweet.find();
    if (!tweets.length) return ""; // Return empty string if no documents

    return tweets.map((tweet) => tweet.tweetContent || "").join("\n");
};


// Main function to fetch and process data
export const main = async () => {
    // console.log("\n======= connecting to db =======\n",);
    await connectDB();
    // console.log("\n======= connected to db =======\n",);

    const scrapedData = await getScrapedData();
    const previousPosts = await getPreviousPosts();
    // console.log("\n======= Got scrapedData =======\n", scrapedData);
    // console.log("\n======= got previousPosts =======\n", previousPosts);

    const postContent = await generatePostContent(scrapedData, previousPosts);

    // console.log("last response:", postContent.postContent);
    const query: string = postContent?.postImageQuery
    const image: string | undefined = await searchImage(query) || undefined;
    console.log("image url", image);

    if (!image) {
        console.log("No image found for the provided query:", query)
        return;
    }
    await postToInsta(image, postContent.postContent);
    // await postToTwitter(image, postContent.postContent)



};

// Execute the function
// main();
