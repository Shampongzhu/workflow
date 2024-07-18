const { AzureOpenAI } = require("openai");

const repository = process.env.REPO
const token = process.env.TOKEN
const event = process.env.EVENT
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-02-01";
const model = "gpt-35-turbo";
const MAX_PATCH_COUNT = 200000;

(async () => {
  async function chat(path) {
    const prompt = `Below is a Github javascript code patch, please help me do a brief code review on it. Any bug risks and/or improvement suggestions are welcome:
      ${path}
    `
    console.log(prompt);
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, model });  
    const { choices } = await client.completions.create({ prompt, model, max_tokens: 4000 });
    return choices[0]?.text
  }

  const { Octokit } = await import("@octokit/rest");
  const [owner, repo] = repository.split('/')
  const { pull_request, number } = JSON.parse(event)

  const octokit = new Octokit({
    auth: token
  });

  const { data } = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base: pull_request.base.sha,
    head: pull_request.head.sha
  })

  const { files: changedFiles, commits } = data;

  for (let i = 0; i < changedFiles.length; i++) {
    const file = changedFiles[i];
    const patch = file.patch || '';

    if (file.status !== 'modified' && file.status !== 'added') {
      continue;
    }

    if (!patch || patch.length > MAX_PATCH_COUNT) {
      continue;
    }

    const res = await chat(patch);

    if (!!res) {
      await octokit.pulls.createReviewComment({
        owner,
        repo,
        pull_number: number,
        commit_id: commits[commits.length - 1].sha,
        path: file.filename,
        body: res,
        position: patch.split('\n').length - 1,
      });
    }
  }
})();

