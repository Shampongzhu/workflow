import { AzureOpenAI } from "openai";
import { Octokit } from "@octokit/rest";

const repo = process.env.REPO
const token = process.env.TOKEN
const event = process.env.EVENT
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-02-01";
const model = "gpt-35-turbo";

const octokit = new Octokit({
  auth: token
});

console.log('===', event)

// const commits = await octokit.rest.repos.compareCommits({
//   owner: 'octocat',
//   repo: 'Hello-World',
//   base: 'commit-sha-1', // 基准提交的 SHA
//   head: 'commit-sha-2'  // 比较提交的 SHA
// })

async function chat(prompt = []) {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, model });  
  const result = await client.completions.create({ prompt, model, max_tokens: 128 });
  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

module.exports = { chat };

