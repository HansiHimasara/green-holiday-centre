// Read-only verification of an ALREADY deployed Node/Next.js release.
// Does not send credentials, create reservations, or modify a database.
const base = process.env.RELEASE_BASE_URL || "";
const expected = process.env.RELEASE_EXPECTED_SHA || "";
if (!/^[a-f0-9]{40}$/i.test(expected)) {
  console.error("RELEASE_EXPECTED_SHA must be the full 40-character git commit SHA.");
  process.exit(1);
}
let url;
try {
  url = new URL(base);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("Invalid production origin");
  }
} catch {
  console.error("RELEASE_BASE_URL must be an HTTPS origin with no path, credentials or query.");
  process.exit(1);
}
async function check(path) {
  const response = await fetch(new URL(path, url), {
    redirect: "error",
    signal: AbortSignal.timeout(12000),
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) throw new Error(`${path} responded HTTP ${response.status}`);
  return response;
}
try {
  await check("/");
  const response = await check("/api/version");
  const data = await response.json();
  if (data?.commitSha?.toLowerCase() !== expected.toLowerCase()) {
    throw new Error("Live commit SHA does not match the reviewed release.");
  }
  console.log("Release verified: HTTPS home page and exact deployed commit SHA.");
} catch (error) {
  console.error("Release verification failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
