import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL!;
if (process.env.TEST_DATABASE_ISOLATED !== "true" || !/^http:\/\/127\.0\.0\.1:\d+$/.test(base)) throw new Error("Only the isolated integration runner may run these tests.");
const password = "Integration-password-47";
let adminCookie = "";
let superCookie = "";
async function call(path: string, method = "GET", data?: unknown, cookie = "", headers: Record<string,string> = {}) {
  return fetch(base + path, { method, headers: { ...(cookie ? { cookie } : {}), ...(data === undefined ? {} : { "Content-Type": "application/json" }), ...headers }, ...(data === undefined ? {} : { body: JSON.stringify(data) }), redirect: "manual" });
}
async function login(email: string, secret = password) {
  const response = await call("/api/auth/login", "POST", { email, password: secret });
  return { response, cookie: response.headers.get("set-cookie")?.split(";")[0] || "" };
}
test("all admin data APIs require a real session", async () => {
  for (const path of ["users", "customers", "vehicles", "bookings", "feedback", "backup", "reports?period=2026-10"]) {
    assert.equal((await call(`/api/admin/${path}`)).status, 401, path);
  }
  assert.equal((await call("/api/auth/me")).status, 401);
  const response = await call("/admin/dashboard");
  assert.equal(response.status, 307);
  assert.match(response.headers.get("location") || "", /\/admin\/login/);
});
test("bad password, disabled account and malformed login fail", async () => {
  assert.equal((await login("admin@example.test", "wrong-password")).response.status, 401);
  assert.equal((await login("disabled@example.test")).response.status, 401);
  assert.equal((await call("/api/auth/login", "POST", { email: [], password })).status, 400);
  const malformed = await fetch(base + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal(malformed.status, 400);
});
test("login issues HttpOnly cookie and admin can load protected data", async () => {
  const result = await login("admin@example.test"); assert.equal(result.response.status, 200);
  assert.match(result.response.headers.get("set-cookie") || "", /HttpOnly/i);
  assert.match(result.response.headers.get("set-cookie") || "", /SameSite=lax/i);
  adminCookie = result.cookie;
  const elevated = await login("super@example.test"); assert.equal(elevated.response.status, 200); superCookie = elevated.cookie;
  assert.equal((await call("/api/admin/bookings", "GET", undefined, adminCookie)).status, 200);
  assert.equal((await call("/api/admin/users", "GET", undefined, adminCookie)).status, 403);
  assert.equal((await call("/api/admin/users", "GET", undefined, superCookie)).status, 200);
});
test("profile photos can be changed and removed without changing account details", async () => {
  const before = (await (await call("/api/auth/me", "GET", undefined, adminCookie)).json()).user;
  const other = (await (await call("/api/auth/me", "GET", undefined, superCookie)).json()).user;
  assert.equal(before.phone, null);
  const first = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGPkzg5gwAaYsIoOWgkAn+cA1mOk0ssAAAAASUVORK5CYII=";
  const second = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGN8v9OGARtgwio6aCUAfiIB9J4MXhkAAAAASUVORK5CYII=";

  assert.equal((await call("/api/auth/me", "PATCH", { photo: first })).status, 401);
  assert.equal((await call("/api/auth/me", "PATCH", {}, adminCookie)).status, 400);
  const upload = await call("/api/auth/me", "PATCH", { photo: first, id: other.id, role: "SUPER_ADMIN" }, adminCookie);
  assert.equal(upload.status, 200);
  const uploaded = (await upload.json()).user;
  assert.equal(uploaded.profileImageUrl, first);
  assert.equal(uploaded.id, before.id);
  assert.equal(uploaded.role, "ADMIN");
  assert.equal(uploaded.passwordHash, undefined);
  for (const field of ["fullName", "username", "email", "phone"]) assert.equal(uploaded[field], before[field]);
  assert.equal((await (await call("/api/auth/me", "GET", undefined, adminCookie)).json()).user.profileImageUrl, first);
  assert.equal((await (await call("/api/auth/me", "GET", undefined, superCookie)).json()).user.profileImageUrl, other.profileImageUrl);

  assert.equal((await call("/api/auth/me", "PATCH", { photo: null })).status, 401);
  assert.equal((await call("/api/auth/me", "PATCH", { photo: null }, adminCookie, { origin: "https://attacker.example" })).status, 403);
  assert.equal((await call("/api/auth/me", "PATCH", { photo: "data:image/png;base64," + Buffer.from("not-an-image-at-all").toString("base64") }, adminCookie)).status, 400);
  assert.equal((await (await call("/api/auth/me", "GET", undefined, adminCookie)).json()).user.profileImageUrl, first);

  const replacement = await call("/api/auth/me", "PATCH", { photo: second }, adminCookie);
  assert.equal(replacement.status, 200);
  assert.equal((await replacement.json()).user.profileImageUrl, second);
  assert.equal((await (await call("/api/auth/me", "GET", undefined, adminCookie)).json()).user.profileImageUrl, second);

  const removal = await call("/api/auth/me", "PATCH", { photo: null }, adminCookie);
  assert.equal(removal.status, 200);
  assert.equal((await removal.json()).user.profileImageUrl, null);
  const removed = (await (await call("/api/auth/me", "GET", undefined, adminCookie)).json()).user;
  assert.equal(removed.profileImageUrl, null);
  for (const field of ["fullName", "username", "email", "phone"]) assert.equal(removed[field], before[field]);
});
test("profile PATCH cannot elevate roles or expose password hashes", async () => {
  const response = await call("/api/auth/me", "PATCH", { fullName: "Updated Admin", username: "testadmin", email: "admin@example.test", phone: "+94771234567", role: "SUPER_ADMIN" }, adminCookie);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.user.role, "ADMIN"); assert.equal(body.user.passwordHash, undefined);
  assert.equal((await (await call("/api/auth/me", "GET", undefined, adminCookie)).json()).user.fullName, "Updated Admin");
});
test("admin cannot create accounts; super admin can create then delete", async () => {
  const body = { fullName: "New Admin", username: "newadmin", email: "newadmin@example.test", password, role: "SUPER_ADMIN" };
  assert.equal((await call("/api/admin/users", "POST", body, adminCookie)).status, 403);
  let list = await (await call("/api/admin/users", "GET", undefined, superCookie)).json();
  assert.equal(list.admins.some((a: { email: string }) => a.email === body.email), false);
  const response = await call("/api/admin/users", "POST", body, superCookie); assert.equal(response.status, 201);
  const created = await response.json(); assert.equal(created.user.role, "ADMIN"); assert.equal(created.user.passwordHash, undefined);
  assert.equal((await call("/api/admin/users", "POST", body, superCookie)).status, 409);
  assert.equal((await call(`/api/admin/users/${created.user.id}`, "DELETE", undefined, adminCookie)).status, 403);
  assert.equal((await call(`/api/admin/users/${created.user.id}`, "DELETE", undefined, superCookie)).status, 200);
  list = await (await call("/api/admin/users", "GET", undefined, superCookie)).json();
  assert.equal(list.admins.some((a: { id: number }) => a.id === created.user.id), false);
});
test("cross-origin profile mutation does not change data", async () => {
  const response = await call("/api/auth/me", "PATCH", { fullName: "Attacker" }, adminCookie, { origin: "https://attacker.example" });
  assert.equal(response.status, 403);
  assert.equal((await (await call("/api/auth/me", "GET", undefined, adminCookie)).json()).user.fullName, "Updated Admin");
});
test("vehicle validation prevents negative rates and valid CRUD persists", async () => {
  const vehicle = { model: "Test Van", passengers: 5, luggage: 3, transmission: "Automatic", fuelType: "Diesel", description: "Test", status: "active", rate: "-100", imageUrl: "" };
  assert.equal((await call("/api/admin/vehicles", "POST", vehicle, adminCookie)).status, 400);
  const created = await call("/api/admin/vehicles", "POST", { ...vehicle, rate: "Rs. 150/km" }, adminCookie);
  assert.equal(created.status, 201); const { vehicle: saved } = await created.json();
  const list = await (await call("/api/admin/vehicles", "GET", undefined, adminCookie)).json();
  assert.equal(list.vehicles.some((v: { dbId: number }) => v.dbId === saved.dbId), true);
  assert.equal((await call(`/api/admin/vehicles/${saved.dbId}`, "DELETE", undefined, adminCookie)).status, 200);
});
test("public forms reject bad data and hide unmoderated feedback", async () => {
  assert.equal((await call("/api/contact", "POST", { name: "Test", email: "bad", message: "Hello" })).status, 400);
  assert.equal((await call("/api/contact", "POST", { name: "Test", email: "guest@example.test", message: "Hello" })).status, 201);
  assert.equal((await call("/api/feedback", "POST", { fullName: "Guest", email: "guest@example.test", rating: 5, message: "Integration feedback" })).status, 201);
  const feedback = await (await call("/api/feedback")).json(); assert.equal(feedback.feedback.length, 0);
});
test("unconfigured gateway never accepts a browser-paid status", async () => {
  assert.equal((await call("/api/booking-payment", "POST", { booking: 1, paymentStatus: "PAID" })).status, 503);
});
test("booking creation computes price and never overwrites an existing guest profile", async () => {
  const vehicles = await (await call("/api/admin/vehicles", "GET", undefined, adminCookie)).json();
  const id = vehicles.vehicles.find((v: { model: string }) => v.model === "Fixture Vehicle").dbId;
  const travelDate = new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10);
  const booking = { requestId: crypto.randomUUID(), serviceType: "AIRPORT_TRANSFER", vehicleTypeId: id, travelDate, passengerCount: 2, luggageCount: 1,
    pickupLocation: "Colombo", dropoffLocation: "Airport", totalAmount: 0.01, currency: "LKR", reservationOnly: true,
    customer: { fullName: "Attacker Name", email: "owner@example.test", phone: "+94771111111", passportNumber: "B123456" } };
  const response = await call("/api/bookings", "POST", booking);
  assert.equal(response.status, 201, await response.clone().text());
  const body = await response.json();
  assert.equal(body.booking.totalAmount, 16); // ((10 km + 20 km) * 150 + 300) / 300
  const retried = await call("/api/bookings", "POST", booking);
  assert.equal(retried.status, 200); assert.equal((await retried.json()).booking.id, body.booking.id);
  assert.equal(body.booking.status, "PENDING");
  assert.match(body.confirmationToken, /^[A-Za-z0-9_-]{43}$/);
  const receipt = await call(`/api/booking-confirmation?booking=${body.booking.id}&token=${body.confirmationToken}`);
  assert.equal(receipt.status, 200);
  const receiptBody = (await receipt.json()).booking;
  assert.equal(receiptBody.totalAmount, 16);
  assert.equal(receiptBody.paymentStatus, "UNPAID");
  assert.equal(receiptBody.vehicleName, "Fixture Vehicle");
  assert.equal(receiptBody.customer, undefined);
  assert.equal(receiptBody.email, undefined);
  assert.equal((await call(`/api/booking-confirmation?booking=${body.booking.id}&token=${"x".repeat(43)}`)).status, 403);
  assert.equal((await call(`/api/booking-confirmation?booking=${body.booking.id + 1}&token=${body.confirmationToken}`)).status, 403);
  assert.equal(body.booking.currency, "USD"); assert.equal(body.booking.paymentStatus, "UNPAID");
  const customers = await (await call("/api/admin/customers", "GET", undefined, adminCookie)).json();
  assert.equal(customers.customers.find((c: { email: string }) => c.email === "owner@example.test").name, "Original Guest");
  assert.equal((await call(`/api/booking-payment?booking=${body.booking.id}&token=invalid`)).status, 403);
  assert.equal((await call(`/api/admin/bookings/${body.booking.id}`, "PATCH", { status: "COMPLETED" }, adminCookie)).status, 409);
  assert.equal((await call(`/api/admin/bookings/${body.booking.id}`, "PATCH", { status: "CANCELLED" }, adminCookie)).status, 200);
  assert.equal((await call(`/api/admin/bookings/${body.booking.id}`, "PATCH", { status: "CONFIRMED" }, adminCookie)).status, 409);
  const cancelledReceipt = await (await call(`/api/booking-confirmation?booking=${body.booking.id}&token=${body.confirmationToken}`)).json();
  assert.equal(cancelledReceipt.booking.status, "CANCELLED");
});
test("profile photo validates file contents and stores the current user's photo", async () => {
  const body = { fullName: "Updated Admin", username: "testadmin", email: "admin@example.test", phone: "+94771234567" };
  assert.equal((await call("/api/auth/me", "PATCH", { ...body, photo: "data:image/png;base64," + Buffer.from("not-an-image-at-all").toString("base64") }, adminCookie)).status, 400);
  const photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=";
  const response = await call("/api/auth/me", "PATCH", { ...body, photo }, adminCookie);
  assert.equal(response.status, 200); assert.equal((await response.json()).user.profileImageUrl, photo);
});
test("expired sessions are rejected without server-component cookie errors", async () => {
  const cookie = `greenholiday_session=${"x".repeat(43)}`;
  assert.equal((await call("/api/auth/me", "GET", undefined, cookie)).status, 401);
  assert.equal((await call("/admin/dashboard", "GET", undefined, cookie)).status, 307);
});
test("password reset is single-use and revokes previous sessions", async () => {
  const body = { token: "r".repeat(43), password: "Changed-password-48", confirmPassword: "Changed-password-48" };
  assert.equal((await call("/api/auth/password-reset/confirm", "POST", body)).status, 200);
  assert.equal((await call("/api/auth/password-reset/confirm", "POST", body)).status, 400);
  assert.equal((await call("/api/auth/me", "GET", undefined, adminCookie)).status, 401);
  assert.equal((await login("admin@example.test")).response.status, 401);
  assert.equal((await login("admin@example.test", body.password)).response.status, 200);
});
test("logout invalidates the session in the database", async () => {
  assert.equal((await call("/api/auth/logout", "POST", undefined, superCookie)).status, 200);
  assert.equal((await call("/api/auth/me", "GET", undefined, superCookie)).status, 401);
});


test("day and round tours save destinations and validate matching overnight dates", async () => {
  const vehicles = await (await call("/api/vehicles")).json();
  const id = vehicles.vehicles.find((v: { name: string }) => v.name === "Fixture Vehicle").id;
  const travelDate = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
  const returnDate = new Date(Date.now() + 12 * 86400000).toISOString().slice(0, 10);
  const payload = { requestId: crypto.randomUUID(), serviceType: "DAY_TOUR", vehicleTypeId: id, travelDate,
    passengerCount: 2, luggageCount: 1, pickupLocation: "Colombo", dropoffLocation: "Airport",
    destinations: ["Kandy"], customer: { fullName: "Tour Guest", email: "tour@example.test", phone: "+94771234567", passportNumber: "C123456" } };
  for (const serviceType of ["DAY_TOUR", "ROUND_TOUR"]) {
    const data = { ...payload, requestId: crypto.randomUUID(), serviceType,
      ...(serviceType === "ROUND_TOUR" ? { destinations: ["Kandy", "Ella"], numberOfNights: 2, returnDate } : {}) };
    const response = await call("/api/bookings", "POST", data);
    assert.equal(response.status, 201, await response.clone().text());
    const saved = await response.json();
    const receipt = await (await call(`/api/booking-confirmation?booking=${saved.booking.id}&token=${saved.confirmationToken}`)).json();
    assert.deepEqual(receipt.booking.destinations, data.destinations);
    assert.equal(receipt.booking.paymentStatus, "UNPAID");
  }
  assert.equal((await call("/api/bookings", "POST", { ...payload, serviceType: "ROUND_TOUR", returnDate, numberOfNights: 10 })).status, 400);
  assert.equal((await call("/api/bookings", "POST", { ...payload, passengerCount: 100 })).status, 400);
  assert.equal((await call("/api/bookings", "POST", { ...payload, travelDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10) })).status, 400);
});
test("unpriced vehicles cannot be selected for online reservations", async () => {
  const response = await call("/api/vehicles");
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.vehicles.some((vehicle: { name: string }) => vehicle.name === "Unpriced Vehicle"), false);
  assert.equal(data.vehicles.some((vehicle: { name: string }) => vehicle.name === "Fixture Vehicle"), true);
});
