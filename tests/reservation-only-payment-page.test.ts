import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const paymentPage = readFileSync("app/customer/booking/payment/page.tsx", "utf8");
const summaryPage = readFileSync("app/customer/booking/summary/page.tsx", "utf8");

test("payment form displays only a saved, server-verified invoice", () => {
  assert.match(paymentPage, /<form\b/);
  assert.match(paymentPage, /\/api\/booking-confirmation\?/);
  assert.match(paymentPage, /name="order\.amount"/);
  assert.match(paymentPage, /name="order\.currency"/);
  assert.match(paymentPage, /name="inv_number"/);
  assert.match(paymentPage, /name="customer_receipt_email"/);
  assert.match(paymentPage, /value=\{amount\} readOnly/);
  assert.match(paymentPage, /value="USD" readOnly/);
  assert.match(paymentPage, /value=\{booking\.bookingReference\} readOnly/);
  assert.match(paymentPage, /type="submit"\s+disabled/);
  assert.doesNotMatch(paymentPage, /<input[^>]*(cardNumber|cardCvc|cardExpiry)/i);
  assert.match(paymentPage, /Online card payments are not available/);
});

test("summary opens payment details with booking ID and receipt token", () => {
  assert.match(summaryPage, /nextPage === "payment" \? "payment" : "confirmation"/);
  assert.match(summaryPage, /reservationOnly: true/);
  assert.match(summaryPage, /Continue to Payment Details/);
});
