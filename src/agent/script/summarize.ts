/* eslint-disable no-unused-vars */
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import logger from "../../config/logger";

import dotenv from "dotenv";
dotenv.config();


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

function cleanTranscript(rawTranscript: string): string {
    // Remove music or any similar tags like [Music], [Applause], etc.
    const cleaned = rawTranscript.replace(/\[.*?\]/g, '');
    const decoded = cleaned.replace(/&amp;#39;/g, "'");
    return decoded;
}

// comment
const MainPrompt = "You are tasked with transforming the YouTube video transcript into a training-ready system prompt. The goal is to format the transcript into structured data without reducing its content, and prepare it for use in training another AI model.";

const getYouTubeTranscriptSchema = () => {
    return {
        description: `Transform the YouTube video transcript into a structured format, suitable for training another AI model. Ensure the content remains intact and is formatted correctly.`,
        type: SchemaType.ARRAY,
        items: {
            type: SchemaType.OBJECT,
            properties: {
                transcriptTitle: {
                    type: SchemaType.STRING,
                    description: "The title of the YouTube video transcript.",
                    nullable: false,
                },
                fullTranscript: {
                    type: SchemaType.STRING,
                    description: "The full, unaltered YouTube video transcript.",
                    nullable: false,
                },
                contentTokenCount: {
                    type: SchemaType.STRING,
                    description: "The total number of tokens in the full transcript.",
                    nullable: false,
                },
            },
            required: [
                "transcriptTitle",
                "fullTranscript",
                "contentTokenCount",
            ],
        },
    };
};

export async function generateTrainingPrompt(transcript: string, prompt: string = MainPrompt): Promise<any> {
    let geminiApiKey = geminiApiKeys[currentApiKeyIndex];
    let currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`;

    if (!geminiApiKey) {
        logger.error("No Gemini API key available.");
        return "No API key available.";
    }

    const schema = await getYouTubeTranscriptSchema();
    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema,
    };

    const googleAI = new GoogleGenerativeAI(geminiApiKey);
    const model = googleAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig,
    });


    const cleanedTranscript = cleanTranscript(transcript);
    // Combine the prompt, title, and transcript for processing
    const combinedPrompt = `${prompt}\n\nVideo Transcript:\n${cleanedTranscript}`;

    try {
        const result = await model.generateContent(combinedPrompt);

        if (!result || !result.response) {
            logger.info("No response received from the AI model. || Service Unavailable");
            return "Service unavailable!";
        }

        const responseText = result.response.text();
        const data = JSON.parse(responseText);

        return data;

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("429 Too Many Requests")) {
                logger.error(`---${currentApiKeyName} limit exhausted, switching to the next API key...`);
                geminiApiKey = getNextApiKey();
                currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`;
                return generateTrainingPrompt(transcript, prompt);
            } else if (error.message.includes("503 Service Unavailable")) {
                logger.error("Service is temporarily unavailable. Retrying...");
                await new Promise(resolve => setTimeout(resolve, 5000));
                return generateTrainingPrompt(transcript, prompt);
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






// comment
const MainPrompt_2 = "You are tasked with transforming the webite scrapped data into a training-ready system prompt. The goal is to format the data into structured data without reducing its content, and prepare it for use in training another AI model.";

const getWebsiteScrapeDatatSchema = () => {
    return {
        description: `Transform the website data into a structured format, suitable for training another AI model. Ensure the content remains intact and is formatted correctly.`,
        type: SchemaType.ARRAY,
        items: {
            type: SchemaType.OBJECT,
            properties: {
                content: {
                    type: SchemaType.STRING,
                    description: "The full, unaltered website scraped data.",
                    nullable: false,
                },
            },
            required: [
                "content",
            ],
        },
    };
};

export async function generateCleanWebsiteData(data: string, prompt: string = MainPrompt_2): Promise<any> {
    let geminiApiKey = geminiApiKeys[currentApiKeyIndex];
    let currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`;

    if (!geminiApiKey) {
        logger.error("No Gemini API key available.");
        return "No API key available.";
    }

    const schema = await getWebsiteScrapeDatatSchema();
    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema,
    };

    const googleAI = new GoogleGenerativeAI(geminiApiKey);
    const model = googleAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig,
    });


    const cleanedTranscript = cleanTranscript(data);
    // Combine the prompt, title, and transcript for processing
    const combinedPrompt = `${prompt}\n\nVideo Transcript:\n${cleanedTranscript}`;

    try {
        const result = await model.generateContent(combinedPrompt);

        if (!result || !result.response) {
            logger.info("No response received from the AI model. || Service Unavailable");
            return "Service unavailable!";
        }

        const responseText = result.response.text();
        const data = JSON.parse(responseText);

        return data;

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("429 Too Many Requests")) {
                logger.error(`---${currentApiKeyName} limit exhausted, switching to the next API key...`);
                geminiApiKey = getNextApiKey();
                currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`;
                return generateTrainingPrompt(data, prompt);
            } else if (error.message.includes("503 Service Unavailable")) {
                logger.error("Service is temporarily unavailable. Retrying...");
                await new Promise(resolve => setTimeout(resolve, 5000));
                return generateTrainingPrompt(data, prompt);
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
