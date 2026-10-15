import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const paymentPage = readFileSync("app/customer/booking/payment/page.tsx", "utf8");
const summaryPage = readFileSync("app/customer/booking/summary/page.tsx", "utf8");
const checkout = readFileSync("app/api/booking-payment/route.ts", "utf8");
const verify = readFileSync("app/api/booking-payment/verify/route.ts", "utf8");

test("invoice fields use token-verified saved booking and bank-hosted checkout", () => {
  assert.match(paymentPage, /<form\b/);
  assert.match(paymentPage, /\/api\/booking-confirmation\?/);
  assert.match(paymentPage, /name="order\.amount"/);
  assert.match(paymentPage, /name="order\.currency"/);
  assert.match(paymentPage, /name="inv_number"/);
  assert.match(paymentPage, /name="customer_receipt_email"/);
  assert.match(paymentPage, /value=\{amount\} readOnly/);
  assert.match(paymentPage, /value="USD" readOnly/);
  assert.match(paymentPage, /value=\{booking\.bookingReference\} readOnly/);
  assert.match(paymentPage, /Pay Securely with Card/);
  assert.match(paymentPage, /Checkout\.showPaymentPage/);
  assert.doesNotMatch(paymentPage, /<input[^>]*(cardNumber|cardCvc|cardExpiry)/i);
});

test("summary preserves reservation option and sends payment choice to checkout", () => {
  assert.match(summaryPage, /nextPage === "payment" \? "payment" : "confirmation"/);
  assert.match(summaryPage, /reservationOnly: true/);
  assert.match(summaryPage, /Continue to Secure Payment/);
  assert.match(summaryPage, /Make a Reservation/);
});

test("gateway session uses saved booking amount and verified payment token", () => {
  assert.match(checkout, /booking\.totalAmount/);
  assert.match(checkout, /verifyReceiptToken/);
  assert.match(checkout, /Only a booking ID and payment token/);
  assert.match(checkout, /MPGS_HOSTED_CHECKOUT/);
  assert.match(verify, /retrieveGatewayOrder/);
  assert.match(verify, /checkCapturedOrder/);
});
