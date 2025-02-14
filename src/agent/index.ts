#!/usr/bin/env node
import boxen from "boxen";
import chalk from "chalk";
import figlet from "figlet";
import { publishContent } from "../publisher";

async function runKush(): Promise<void> {
  try {

    // Render ASCII art
    const bannerText: string = await new Promise((resolve, reject) => {
      figlet("KUSH", { font: "Ghost" }, (err, data) => {
        if (err) {
          reject("Something went wrong..." + err);
        } else {
          resolve(data || "");
        }
      });
    });

    console.log(`\n`);
    console.log(chalk.cyan(bannerText));

    // Social links
    const twitterLink : string = "https://x.com/davepatty5686";
    const buymeaCoffeeLink : string = "https://buymeacoffee.com/davidpatrickchuks";

    const twitter = `${chalk.white("🐦 Follow @")} ${chalk.cyan(twitterLink)}`;
    const buyMeCoffee = `${chalk.white("💰 Support @")} ${chalk.cyan(buymeaCoffeeLink)}`;

    const header = `${twitter}\n${buyMeCoffee}`;

    console.log(
      boxen(header, {
        borderColor: "grey",
        borderStyle: "classic",
        align: "left",
      })
    );
    console.log(`\n`);


    // Publish the content
    await publishContent();

  } catch (error) {
    console.error(chalk.red.bold("✖ An error occurred:"), error);
  }
}

// Start the application
runKush();
