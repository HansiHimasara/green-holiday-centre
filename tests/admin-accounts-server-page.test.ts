import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("super-admin account list first view excludes passwords and checks role", () => {
  const page = readFileSync("app/admin/accounts/page.tsx", "utf8");
  const client = readFileSync("app/admin/accounts/AccountsClient.tsx", "utf8");
  assert.ok(page.includes('requireSuperAdmin'));
  assert.ok(page.includes('force-dynamic'));
  assert.ok(page.includes('db.orm.public.User.where({ role: "ADMIN" })'));
  assert.ok(!page.includes('passwordHash:'));
  assert.ok(!client.includes('useEffect('));
});
