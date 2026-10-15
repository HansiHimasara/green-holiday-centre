import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "../app/api/version/route";

test("/api/version reports only the configured full commit SHA", async () => {
  const old = process.env.DEPLOY_COMMIT_SHA;
  const oldVercel = process.env.VERCEL_GIT_COMMIT_SHA;
  const oldGithub = process.env.GITHUB_SHA;
  try {
    delete process.env.VERCEL_GIT_COMMIT_SHA;
    delete process.env.GITHUB_SHA;
    process.env.DEPLOY_COMMIT_SHA = "a".repeat(40);
    const ok = await GET();
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { commitSha: "a".repeat(40) });
    delete process.env.DEPLOY_COMMIT_SHA;
    const missing = await GET();
    assert.equal(missing.status, 503);
  } finally {
    if (old === undefined) delete process.env.DEPLOY_COMMIT_SHA;
    else process.env.DEPLOY_COMMIT_SHA = old;
    if (oldVercel === undefined) delete process.env.VERCEL_GIT_COMMIT_SHA;
    else process.env.VERCEL_GIT_COMMIT_SHA = oldVercel;
    if (oldGithub === undefined) delete process.env.GITHUB_SHA;
    else process.env.GITHUB_SHA = oldGithub;
  }
});
