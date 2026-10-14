import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("admin profile first view reads only the current session on the server", () => {
  const page = readFileSync("app/admin/profile/page.tsx", "utf8");
  const client = readFileSync("app/admin/profile/ProfileClient.tsx", "utf8");
  assert.ok(page.includes("getCurrentUser"));
  assert.ok(page.includes('force-dynamic'));
  assert.ok(page.includes('redirect("/admin/login")'));
  assert.ok(!page.includes('"use client"'));
  assert.ok(!client.includes('useEffect('));
  assert.ok(client.includes('initialProfile'));
});
