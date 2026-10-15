import { withApi } from "@/src/server/http/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Set DEPLOY_COMMIT_SHA to the exact release SHA at build/deploy time.
// Vercel and CI expose their own SHA variables automatically.
async function handleGET() {
  const sha = process.env.DEPLOY_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "";
  if (!/^[a-f0-9]{40}$/i.test(sha)) {
    return Response.json({ error: "Deployment revision not configured." }, { status: 503 });
  }
  return Response.json({ commitSha: sha }, { status: 200 });
}

export const GET = withApi(handleGET, "/api/version");
