import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("public feedback uses server data and only publishes approved reviews", () => {
  const page = readFileSync("app/customer/feedback/page.tsx", "utf8");
  const client = readFileSync("app/customer/feedback/PublicFeedbackClient.tsx", "utf8");
  assert.ok(page.includes('visibility: "VISIBLE"'));
  assert.ok(page.includes('force-dynamic'));
  assert.ok(page.includes('db.orm.public.Feedback.where'));
  assert.ok(!page.includes('"use client"'));
  assert.ok(!client.includes('useEffect('));
  assert.ok(client.includes('initialReviews'));
});
