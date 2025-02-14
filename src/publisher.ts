import ora from 'ora';
import axios, { AxiosResponse } from "axios";
import chalk from "chalk";
import dotenv from "dotenv";
import { generateContent } from "./generator";
import { PublishPostInput, PublishPostResponse } from "./types";

dotenv.config();

const token: string | undefined = process.env.HASHNODE_ACCESS_TOKEN;
const publicationId: string | undefined = process.env.HASHNODE_PUBLICATION_ID;

// Delay function to pause execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const spinner = ora({
  text: chalk.cyan("\n📝 Publishing content..."),
  spinner: "dots",
});

// Ensure these are defined or throw an error
if (!token || !publicationId) {
  console.error(
    chalk.red.bold("\n✖ Missing environment variables: HASHNODE_ACCESS_TOKEN or HASHNODE_PUBLICATION_ID")
  );
  process.exit(1); // Exit if crucial environment variables are missing
}

const query = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        url
      }
    }
  }
`;

async function publishContent(): Promise<PublishPostInput | void> {
  try {
    // Assuming generateContent could return a string in some cases (e.g., error message)
    const result = await generateContent();

    // Type guard: Check if result is a string
    if (typeof result === "string") {
      console.error(chalk.red.bold("\n✖ Error generating content: "), result);
      return;
    }

    // Now we can safely use result as a GeneratedPost
    const {
      title,
      subtitle,
      topic,
      topicSlug,
      contentMarkdown,
      image,
    } = result;

    if (title && subtitle && contentMarkdown && image) {
      console.log(chalk.cyan("⏳ Preparing to publish content...\n"));
      // Start loading spinner
      spinner.start();
      // Delay before publishing
      await delay(2000);  // 2 seconds delay before publishing
      spinner.stop();
    }

    const publishPostInput: PublishPostInput = {
      publicationId: publicationId,
      title: title,
      subtitle: subtitle,
      contentMarkdown: contentMarkdown,
      coverImageOptions: {
        coverImageURL: image,
      },
      tags: [
        {
          name: topic,
          slug: topicSlug,
        },
      ],
    };

    const response: AxiosResponse<PublishPostResponse> = await axios.post(
      "https://gql.hashnode.com/",
      {
        query: query,
        variables: {
          input: publishPostInput,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data.errors) {
      const error = response.data.errors[0];
      if (error.extensions) {
        console.error(
          chalk.red.bold(`\n✖ GraphQL Error (${error.extensions.code}): ${error.message}`)
        );
      } else {
        console.error(chalk.red.bold(`\n✖ GraphQL Error: ${error.message}`));
      }
      return;
    }

    if (response.data.data?.publishPost?.post) {
      // Delay before confirming success
      await delay(1500);  // 1.5 seconds delay before confirming
      // Stop spinner on success
      spinner.succeed(chalk.green(`Post published successfully at: ${chalk.underline.bgWhite(response.data.data.publishPost.post.url)}\n`));
      return publishPostInput; // Return the publishPostInput object directly
    } else {
      console.warn(
        chalk.yellow("\n⚠ Post published but received unexpected response format:"),
        response.data
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      spinner.fail(
        chalk.red.bold("\n✖ Error publishing content:")
      );
    } else {
      spinner.fail(
        chalk.red.bold("\n✖ Unknown error publishing content:")
      );
    }
  }
}

export { publishContent };
