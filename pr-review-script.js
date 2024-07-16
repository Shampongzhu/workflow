const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const OPENAI_APIKEY = process.env.OPENAI_APIKEY

async function main() {
  const client = new OpenAIClient('https://chataihub3097202828.openai.azure.com/', new AzureKeyCredential(OPENAI_APIKEY));

  const { choices } = await client.getCompletions(
    'gpt-35-turbo', // assumes a matching model deployment or model name
    ['Hello, world!'],
  );

  for (const choice of choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
});
