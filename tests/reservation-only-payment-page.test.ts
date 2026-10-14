import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("app/customer/booking/payment/page.tsx", "utf8");
test("reservation-only checkout does not ask guests to type card details", () => {
  assert.doesNotMatch(page, /<input[^>]*(cardNumber|cardCvc|cardExpiry)/i);
  assert.doesNotMatch(page, /<form\b/);
  assert.match(page, /Online card payments are not available/);
  assert.match(page, /View booking confirmation/);
});
