import { test } from "node:test";
import assert from "node:assert/strict";
import { earliestBookingDate, validBookingDate } from "../src/server/bookingDates";
import { paymentLinkToken, verifyPaymentLink } from "../src/server/bookingLinks";

test("two day advance notice uses Sri Lanka calendar date at UTC boundary", () => {
  const now = new Date("2026-09-28T19:00:00Z"); // September 29 in Colombo
  assert.equal(earliestBookingDate(now), "2026-10-01");
  assert.equal(validBookingDate("2026-09-30", now), false);
  assert.equal(validBookingDate("2026-10-01", now), true);
  assert.equal(validBookingDate("2026-02-30", now), false);
});

test("payment link cannot be reused for another booking or email", () => {
  process.env.BOOKING_LINK_SECRET = "a-secret-with-at-least-thirty-two-characters";
  const token = paymentLinkToken(15, "guest@example.com");
  assert.equal(verifyPaymentLink(15, "guest@example.com", token), true);
  assert.equal(verifyPaymentLink(16, "guest@example.com", token), false);
  assert.equal(verifyPaymentLink(15, "other@example.com", token), false);
});
