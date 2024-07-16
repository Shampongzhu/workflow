const { AzureOpenAI } = require("openai");

const repo = process.env.REPO
const token = process.env.TOKEN
const event = process.env.EVENT
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-02-01";
const model = "gpt-35-turbo";


(async () => {
  const { Octokit } = await import("@octokit/rest");
  const ary = repo.split('/')
  const { pull_request } = JSON.parse(event)

  const octokit = new Octokit({
    auth: token
  });

  console.log('===', pull_request)

  // const { data } = await octokit.rest.repos.compareCommits({
  //   owner: ary[0],
  //   repo: ary[1],
  //   base: 'commit-sha-1', // 基准提交的 SHA
  //   head: 'commit-sha-2'  // 比较提交的 SHA
  // })

  // console.log(data);
})();

async function chat(prompt = []) {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, model });  
  const result = await client.completions.create({ prompt, model, max_tokens: 128 });
  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

module.exports = { chat };

