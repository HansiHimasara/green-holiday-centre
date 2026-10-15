import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const routeFolders = [
  "app", "app/admin", "app/admin/login", "app/admin/accounts", "app/admin/backup",
  "app/admin/bookings", "app/admin/customers", "app/admin/dashboard", "app/admin/feedback",
  "app/admin/profile", "app/admin/reports", "app/admin/vehicles", "app/customer",
  "app/customer/contact", "app/customer/feedback", "app/customer/login", "app/customer/vehicle",
  "app/customer/vehicles", "app/customer/vehicles/[id]", "app/customer/booking",
  "app/customer/booking/airport-transfer", "app/customer/booking/day-tour",
  "app/customer/booking/round-tour", "app/customer/booking/customer-details",
  "app/customer/booking/summary", "app/customer/booking/payment",
  "app/customer/booking/confirmation",
];

test("route segments below the global and admin shells provide loading feedback", () => {
  // A parent loading.tsx can stream HTTP 200 before a nested admin layout
  // checks the session and issues its expected HTTP 307 redirect.
  for (const folder of routeFolders.filter(folder => folder !== "app" && folder !== "app/admin")) {
    assert.ok(existsSync(join(root, folder, "loading.tsx")), `${folder} lacks loading.tsx`);
  }
});


test("top-level loading boundaries do not swallow admin redirect status", () => {
  assert.equal(existsSync(join(root, "app", "loading.tsx")), false);
  assert.equal(existsSync(join(root, "app", "admin", "loading.tsx")), false);
  // Scoped loaders remain inside guarded admin route layouts.
  assert.ok(existsSync(join(root, "app", "admin", "dashboard", "loading.tsx")));
  const protectedLayout = readFileSync(join(root, "app", "admin", "dashboard", "layout.tsx"), "utf8");
  assert.ok(protectedLayout.includes("requireAdminUser") && protectedLayout.includes("redirect"));
});

test("each user-facing area has scoped error recovery", () => {
  for (const folder of routeFolders) {
    assert.ok(existsSync(join(root, folder, "error.tsx")), `${folder} lacks error.tsx`);
  }
  assert.ok(existsSync(join(root, "app", "global-error.tsx")));
});

test("loading and error fallbacks don't expose runtime exception details", () => {
  const fallback = readFileSync(join(root, "components/ui/RouteError.tsx"), "utf8");
  assert.ok(fallback.includes("reset"));
  assert.ok(!fallback.includes("error.message") && !fallback.includes("error.stack"));
});
