// Fail the CI build if any API endpoint bypasses our shared security wrapper or
// if a private environment file was accidentally committed to the repository.
import { readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

function routes(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) return routes(entryPath);
    return entry.name === "route.ts" ? [entryPath] : [];
  });
}
const files = routes("app/api");
const unprotected = files.filter(file => !/withApi\(/.test(readFileSync(file, "utf8")));
if (unprotected.length) throw new Error(`Unprotected API routes:\n${unprotected.join("\n")}`);
let tracked = [];
try { tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean); }
catch { console.warn("Git index unavailable; skipping committed-file secret check."); }
const secrets = tracked.filter(name => /(?:^|\/)\.env(?:\..*)?$/.test(name) && !name.endsWith(".env.example"));
if (secrets.length) throw new Error(`Private environment files were added to Git:\n${secrets.join("\n")}`);
console.log(`Security source checks passed: ${files.length} API routes use withApi; no tracked private .env files.`);
