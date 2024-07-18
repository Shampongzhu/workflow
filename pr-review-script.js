const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const repository = process.env.REPO
const token = process.env.TOKEN
const event = process.env.EVENT
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.OPENAI_APIKEY;
const apiVersion = "2024-02-01";
const model = "gpt-35-turbo";
const MAX_PATCH_COUNT = 200000;

const client = new OpenAIClient(
  endpoint,
  new AzureKeyCredential(apiKey)
);

(async () => {
  async function chat(path) {
    const message = `下面是Github的代码提交补丁信息，请做一下代码审查，找出可能有风险的地方，尽量准确：
      ${path}
    `
    const { id, created, choices, usage } = await client.getCompletions("zxp", [message]);
    console.log('===', id, created, choices, usage)
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

    // if (!!res) {
    //   await octokit.pulls.createReviewComment({
    //     owner,
    //     repo,
    //     pull_number: number,
    //     commit_id: commits[commits.length - 1].sha,
    //     path: file.filename,
    //     body: res,
    //     position: patch.split('\n').length - 1,
    //   });
    // }
  }
})();

