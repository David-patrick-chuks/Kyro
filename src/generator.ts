import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";
import dotenv from "dotenv";
import { searchImage } from "./image-search";
import { Instruction } from "./prompt/index";
import { BlogTopic } from "./topics/index";
import { getApiKeys } from "./utils/index";
import { GeneratedPost } from "./types";
dotenv.config();

let currentApiKeyIndex = 0;
let geminiApiKeys: string[] = getApiKeys();

// Function to get the next API key in the list
const getNextApiKey = (): string => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length; 
  return geminiApiKeys[currentApiKeyIndex];
};

// Delay function to pause execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to generate content
async function generateContent(): Promise<{
  title: string;
  subtitle: string;
  topic: string;
  topicSlug: string;
  tags: string[];
  keywords: string[];
  coverImageQuery: string;
  contentMarkdown: string;
  image?: string;
} | string> {
  let geminiApiKey = geminiApiKeys[currentApiKeyIndex]; 
  let currentApiKeyName = `API_KEY_${currentApiKeyIndex + 1}`; 

  try {
    const Topic = BlogTopic.getRandomTopic();
    await delay(1000); // Add delay before logging
    console.log(chalk.magenta(`\n💭 Kush is thinking... Topic: "${Topic}"`));

    await delay(1000); // Add delay before next logging
    console.log(chalk.blue("\n🔍 Analyzing topic..."));

    if (!geminiApiKey) {
      await delay(1000); // Delay before error message
      console.log(chalk.red("\n❌ Oops! No API key available. Can't continue the process."));
      return "No API key available.";
    }

    await delay(1000); // Delay before next log
    // console.log(chalk.cyan(`\n🗝️  Key: ${currentApiKeyName} selected. Let's proceed with the analysis.`));

    const generationConfig = {
      responseMimeType: "application/json",
    };

    const googleAI = new GoogleGenerativeAI(geminiApiKey);
    const model = googleAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      systemInstruction: Instruction,
    });

    const prompt = `I need to create a detailed blog post on the topic of "${Topic}". Let’s dive in and break it down step-by-step.`;
    await delay(1000); // Delay before processing prompt log
    console.log(chalk.yellow(`\n🧠 Kush is processing prompt`));
    // console.log(chalk.yellow(`\n🧠 Kush is processing prompt: "${prompt}"`));

    // Kush thinks: Generate the content
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      await delay(1000); // Delay before error log
      console.log(chalk.red("\n❌ Hmm... something went wrong. The response from Kush is missing."));
      return "Service unavailable!";
    }

    const responseText = result.response.text();
    const post: GeneratedPost = JSON.parse(responseText);

    if (post) {
      await delay(1000); // Delay before success log
      console.log(chalk.green.bold("\n🤖 Kush: Content successfully generated!"));
    }

    await delay(1000); // Delay before image search log
    console.log(chalk.blue("\n🔎 Searching for the perfect cover image..."));
    const query = `${post.coverImageQuery}`;
    const image: string | undefined = await searchImage(query) || undefined;

    if (image) {
      await delay(1500); // Delay before image found log
      console.log(chalk.green(`🖼 Image found: ${chalk.underline(image)}`));
    } else {
      await delay(1500); // Delay before image not found log
      console.log(chalk.yellow("\n❓ Hmm... no image found. We might need to adjust our search."));
    }

    await delay(1000); // Delay before final log
    console.log(chalk.white("\n🔧 Compiling the final result...\n"));
    return {
      title: post.title,
      subtitle: post.subtitle,
      topic: post.topic,
      topicSlug: post.topicSlug,
      tags: post.tags,
      keywords: post.keywords,
      coverImageQuery: post.coverImageQuery,
      contentMarkdown: post.contentMarkdown,
      image,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429 Too Many Requests")) {
        await delay(1000); // Delay before retrying
        console.error(chalk.red(`\n--- Uh-oh, ${currentApiKeyName} limit reached. Switching to the next API key...`));
        geminiApiKey = getNextApiKey(); // Switch to the next API key
        currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`; // Update the name
        return generateContent(); // Retry with the new API key
      } else if (error.message.includes("503 Service Unavailable")) {
        await delay(1000); // Delay before retrying
        console.error(chalk.red("\n❌ Service is temporarily down. Please hold on... Retrying shortly."));
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
        return generateContent(); // Retry the request
      } else {
        await delay(1000); // Delay before logging other errors
        console.error(chalk.red("\n🚨 Error while running Kush:", error.message));
        return "An error occurred while generating content.";
      }
    } else {
      await delay(1000); // Delay before logging unexpected errors
      console.error(chalk.red("\n❗ Unexpected error occurred:", error));
      return "An unexpected error occurred.";
    }
  }
}

export { generateContent };
