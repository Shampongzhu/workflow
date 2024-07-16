const { AzureOpenAI } = require("openai");

const endpoint = process.env.ENDPOINT;
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-02-01";
const deployment = "gpt-35-turbo";
const prompt = ["When was Microsoft founded?"];

async function main() {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });  
  const result = await client.completions.create({ prompt, model: deployment, max_tokens: 128 });
  console.log('===', result)
  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error("Error occurred:", err);
});

module.exports = { main };

