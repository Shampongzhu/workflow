const { AzureOpenAI } = require("openai");

const dotenv = require("dotenv");
dotenv.config();

const endpoint = 'https://chataihub3097202828.openai.azure.com/';
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-02-15-preview";
const deployment = "gpt-4o";
const prompt = ["When was Microsoft founded?"];

async function main() {
  console.log("== Get completions Sample ==");

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });  

  const result = await client.chat.completions.create({ prompt, model: deployment, max_tokens: 128 });

  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error("Error occurred:", err);
});

module.exports = { main };

