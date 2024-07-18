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
    let prompt = `下面是Github的代码提交补丁信息，请做一下代码审查，找出可能有风险的地方，尽量准确：
      ${path}
    `
    console.log('======\n')
    console.log(prompt);
    console.log('=====\n')

    prompt = 'javascript中如保无法禁止使用eval，请给出保持代码安全的建议，尽量简洁准确：'
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, model });  
    const { choices } = await client.completions.create({ prompt, model, max_tokens: 300 });
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

