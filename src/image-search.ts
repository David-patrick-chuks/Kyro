import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import chalk from "chalk";
import { GoogleSearchResponse } from "./types";

dotenv.config();

// Safely retrieve environment variables and ensure they are not undefined
const API_KEY: string | undefined = process.env.GOOGLE_API_KEY;
const CX: string | undefined = process.env.SEARCH_ENGINE_ID;

if (!API_KEY || !CX) {
  console.error(
    chalk.red.bold("\n✖ Missing required environment variables: GOOGLE_API_KEY or SEARCH_ENGINE_ID")
  );
  process.exit(1); // Exit the process if the environment variables are not defined
}


async function searchImage(query: string): Promise<string | null> {
  const url = `https://customsearch.googleapis.com/customsearch/v1`;
  const params = {
    c2coff: "1",
    cx: CX,
    fileType: "JPEG,PNG",
    q: query,
    safe: "off",
    searchType: "image",
    prettyPrint: "true",
    num: 1,
    key: API_KEY,
  };

  try {
    console.log(chalk.yellow(`\n🔍 Searching image for: ${chalk.italic(query)}`));
    const response: AxiosResponse<GoogleSearchResponse> = await axios.get(url, { params });

    if (response.data.items && response.data.items.length > 0) {
      // console.log(chalk.green(`\n✔️ Image found!`));
      return response.data.items[0].link;
    }

    console.log(chalk.yellow("\n⚠️ No images found for the query."));
    return null; // In case no image was found
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        chalk.red.bold("\n✖ Error fetching image:"),
        chalk.red(error.message)
      );
    } else {
      console.error(chalk.red.bold("\n✖ Unknown error occurred:"), chalk.red(error));
    }
    return null; // Return null in case of an error
  }
}

export { searchImage };
