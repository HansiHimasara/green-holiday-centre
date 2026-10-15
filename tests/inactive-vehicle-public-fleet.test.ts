import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = (path: string) => readFileSync(path, "utf8");

test("public fleet displays vehicles of both statuses", () => {
  assert.match(source("src/server/vehicles.ts"), /publicFleetVehicles[\s\S]*?VehicleType\.all\(\)/);
  assert.match(source("app/customer/vehicles/page.tsx"), /publicFleetVehicles\(\)/);
  assert.match(source("app/page.tsx"), /publicFleetVehicles\(\)/);
});

test("inactive fleet cards and homepage cards have no active navigation", () => {
  const card = source("components/vehicles/VehicleCard.tsx");
  const home = source("app/page.tsx");
  assert.match(card, /available\s*\?\s*\(/);
  assert.match(card, /Currently Unavailable/);
  assert.match(home, /vehicle\.available\s*\?\s*\(/);
  assert.match(home, /Currently Unavailable/);
  const detail = source("app/customer/vehicles/[id]/page.tsx");
  assert.match(detail, /const available = row\.status === "ACTIVE"/);
  assert.match(detail, /Currently Unavailable/);
});

test("booking selectors and server endpoints still prevent inactive bookings", () => {
  const list = source("app/api/vehicles/route.ts");
  assert.match(list, /status:\s*"ACTIVE"/);
  assert.match(source("app/api/bookings/route.ts"), /vehicle\.status !== "ACTIVE"/);
  assert.match(source("app/api/booking-quote/route.ts"), /vehicle\.status !==[\s\n]*"ACTIVE"/);
});
