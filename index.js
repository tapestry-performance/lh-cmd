const fs = require("fs");
const { promisify } = require("util");
const inquirer = require("inquirer");
const open = require("open");
require("dotenv").config();
const Page = require("./helpers/Page");
const { runLighthouse, runCLS } = require("./helpers/functions");
const { inputPrompt, clsPrompt } = require("./helpers/prompts");
const { fetchSheet } = require("./sheets");

let currentFile = "";

/**
 * @param {array} url list
 */

async function askForURL(arr) {
  try {
    const { url } = await inquirer.prompt([
      {
        name: "url",
        type: "list",
        message: "Select a url",
        choices: [...arr.map(({ url }) => url), "Or enter URL"],
      },
    ]);

    if (url === "Or enter URL") {
      const { url, filename } = await inquirer.prompt(inputPrompt);

      const page = new Page("Entered URL", filename, url);

      if (!page.filename) {
        page.createFilename();
      }

      return page;
    }
    return arr.find((page) => page.url === url);
  } catch (err) {
    console.log(err);
  }
}

async function askForCLS(page) {
  const { cls } = await inquirer.prompt(clsPrompt);
  if (cls) {
    page.cls = true;
  }

  return;
}

(async () => {
  const urls = await fetchSheet(process.env.SHEET_NAME);

  const pages = urls.map((url) => {
    const page = new Page("temp", "temp", url);
    page.createFilename();
    return page;
  });

  const input = await askForURL(pages);
  await askForCLS(input);
  await runLighthouse(input);
  console.log("\nLighthouse report opened in default browser\n");
  if (input.cls) {
    await runCLS(input);
    await open(`${input.filename}.gif`);
    console.log("\nCLS gif opened in default photo viewer\n");
  }
})();
