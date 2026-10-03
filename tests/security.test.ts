import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/server/auth/password";
import { authorize, verifyOrigin, consumeLimit, withApi } from "../src/server/http/guard";
import { HttpError, validateBody, parseVehicleRate, readJson } from "../src/server/http/validation";
import { verifyPaymentLink } from "../src/server/bookingLinks";

test("password hashes use unique salts and reject incorrect/malformed credentials", async () => {
  const first = await hashPassword("Example-password-47");
  const second = await hashPassword("Example-password-47");
  assert.notEqual(first, second);
  assert.equal(await verifyPassword("Example-password-47", first), true);
  assert.equal(await verifyPassword("incorrect", first), false);
  assert.equal(await verifyPassword("anything", "scrypt$16384$8$1$salt$zz"), false);
  assert.equal(await verifyPassword("anything", first.replace("$16384$", "$1$")), false);
  await assert.rejects(hashPassword("short"));
  await assert.rejects(hashPassword("x".repeat(129)));
});
test("authorization distinguishes missing session and insufficient role", () => {
  assert.throws(() => authorize(null), (e: unknown) => e instanceof HttpError && e.status === 401);
  assert.throws(() => authorize({ role: "ADMIN", status: "DISABLED" }));
  assert.throws(() => authorize({ role: "ADMIN", status: "ACTIVE" }, true), (e: unknown) => e instanceof HttpError && e.status === 403);
  assert.throws(() => authorize({ role: "CUSTOMER", status: "ACTIVE" }));
  authorize({ role: "ADMIN", status: "ACTIVE" });
  authorize({ role: "SUPER_ADMIN", status: "ACTIVE" }, true);
});
test("cross-site mutations are rejected and same-origin requests accepted", () => {
  assert.throws(() => verifyOrigin(new Request("https://travel.example/api/auth/logout", { method: "POST", headers: { origin: "https://attacker.example" } })));
  verifyOrigin(new Request("https://travel.example/api/auth/logout", { method: "POST", headers: { origin: "https://travel.example" } }));
});
test("validation rejects coercion, oversized fields, invalid phone and arrays", () => {
  for (const body of [null, [], { email: {} }, { remember: "false" }, { password: "x".repeat(129) }, { phone: "abc" }, { passengers: true }, { destinations: [null] }]) {
    assert.throws(() => validateBody(body, "/api/bookings"));
  }
  validateBody({ email: "guest@example.com", phone: "+94771234567", passengers: 2 }, "/api/contact");
  validateBody({ customer: "Guest", feedback: "Good", rating: 5, status: "visible" }, "/api/admin/feedback");
});
test("vehicle rates do not silently convert negative or malformed values", () => {
  assert.equal(parseVehicleRate("Rs. 150/km"), 150);
  assert.ok(Number.isNaN(parseVehicleRate("-150")));
  assert.ok(Number.isNaN(parseVehicleRate("abc150")));
  assert.ok(Number.isNaN(parseVehicleRate(true)));
});
test("rate limiter rejects excess attempts and releases expired windows", () => {
  consumeLimit("unit-test", 2, 1000); consumeLimit("unit-test", 2, 1000);
  assert.throws(() => consumeLimit("unit-test", 2, 1000));
  consumeLimit("unit-test", 2, 901001);
});
test("payment verification rejects malicious unicode without crashing", () => {
  assert.equal(verifyPaymentLink(1, "a@example.com", "é".repeat(43)), false);
});
test("malformed JSON is a 400 response and handler is never called", async () => {
  let called = false;
  const handler = withApi(async (request: Request) => { assert.equal(request.method, "POST"); called = true; return Response.json({ ok: true }); }, "/api/contact");
  const response = await handler(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }));
  assert.equal(response.status, 400); assert.equal(called, false);
});
test("request parser refuses oversized bodies", async () => {
  await assert.rejects(readJson(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "a".repeat(70000) }) })), (e: unknown) => e instanceof HttpError && e.status === 413);
});
