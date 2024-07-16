const { AzureOpenAI } = require("openai");

// Load the .env file if it exists
const dotenv = require("dotenv");
dotenv.config();

// You will need to set these environment variables or edit the following values
const endpoint = 'https://chataihub3097202828.openai.azure.com/';
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-04-01-preview";
const deployment = "gpt-35-turbo-instruct"; //The deployment name for your completions API model. The instruct model is the only new model that supports the legacy API.

const prompt = ["When was Microsoft founded?"];

async function main() {
  console.log("== Get completions Sample ==");

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });  

  const result = await client.completions.create({ prompt, model: deployment, max_tokens: 128 });

  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error("Error occurred:", err);
});

module.exports = { main };

