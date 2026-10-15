import { test } from "node:test";
import assert from "node:assert/strict";
import { checkCapturedOrder } from "../src/server/mpgs";

const orderId = "GHC-123-1234567890ABCDEF12345678";
const valid = { id: orderId, currency: "USD", amount: "125.00", totalCapturedAmount: "125.00", result: "SUCCESS", status: "CAPTURED" };

test("only exact fully captured successful gateway orders are paid", () => {
  assert.equal(checkCapturedOrder(valid, orderId, "125.00", "USD"), "PAID");
  assert.equal(checkCapturedOrder({ ...valid, status: "INITIATED" }, orderId, "125.00", "USD"), "PENDING");
  assert.equal(checkCapturedOrder({ ...valid, result: "FAILURE" }, orderId, "125.00", "USD"), "PENDING");
  assert.equal(checkCapturedOrder({ ...valid, status: "FAILED" }, orderId, "125.00", "USD"), "FAILED");
  assert.equal(checkCapturedOrder({ ...valid, totalCapturedAmount: "50.00" }, orderId, "125.00", "USD"), "PENDING");
});

test("mismatched order IDs, amounts and currencies are never accepted", () => {
  assert.throws(() => checkCapturedOrder({ ...valid, id: "ANOTHER" }, orderId, "125.00", "USD"));
  assert.throws(() => checkCapturedOrder({ ...valid, amount: "1.00" }, orderId, "125.00", "USD"));
  assert.throws(() => checkCapturedOrder({ ...valid, currency: "LKR" }, orderId, "125.00", "USD"));
});
