const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const { OPENAI_APIKEY } = process.env.REPO_SECRET
async function main() {
  const client = new OpenAIClient('https://chataihub3097202828.openai.azure.com/', new AzureKeyCredential(OPENAI_APIKEY));

  const { choices } = await client.getCompletions(
    'text-davinci-003', // assumes a matching model deployment or model name
    ['Hello, world!'],
  );

  for (const choice of choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
});
