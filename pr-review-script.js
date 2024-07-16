const { AzureOpenAI } = require("openai");

const repo = process.env.REPO
const token = process.env.TOKEN
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-02-01";
const model = "gpt-35-turbo";

console.log('===', repo, token)

async function chat(prompt = []) {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, model });  
  const result = await client.completions.create({ prompt, model, max_tokens: 128 });
  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

module.exports = { chat };

