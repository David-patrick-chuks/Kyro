import figlet from "figlet";
import chalk from "chalk";
import boxen from "boxen";

async function runKyro(): Promise<void> {
  try {
    // Render ASCII art
    const bannerText: string = await new Promise((resolve, reject) => {
      figlet("KYRO", { font: "Ghost" }, (err, data) => {
        if (err) {
          reject("Something went wrong..." + err);
        } else {
          resolve(data || "");
        }
      });
    });

    console.log(`\n`);
    console.log(chalk.cyan(bannerText));

    // Shortened CLI-style startup sequence
    console.log(chalk.green.bold("[BOOT] Kyro AI initializing..."));
    await delay(800);
    console.log(chalk.yellow("[SYSTEM] Establishing secure connection... 🔐"));
    await delay(1000);
    console.log(chalk.green.bold("[READY] Kyro AI is now online. 🚀"));
    console.log("\n");

  } catch (error) {
    console.error(chalk.red.bold("✖ [ERROR] System Failure:"), error);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

runKyro();
