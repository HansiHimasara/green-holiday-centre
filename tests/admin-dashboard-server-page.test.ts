import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("ICA6 dashboard: authenticated, private DB-backed server first view", () => {
  const page = readFileSync("app/admin/dashboard/page.tsx", "utf8");
  const client = readFileSync("app/admin/dashboard/DashboardClient.tsx", "utf8");
  assert.ok(!page.includes('"use client"'));
  assert.ok(page.includes("requireAdminUser"));
  assert.ok(page.includes("force-dynamic"));
  assert.ok(page.includes("db.orm.public."));
  assert.ok(page.includes('redirect("/admin/login")'));
  assert.ok(!page.includes("fetch("));
  assert.ok(client.includes('"use client"'));
  assert.ok(!client.includes("useEffect("));
  assert.ok(client.includes("useState<"));
});
