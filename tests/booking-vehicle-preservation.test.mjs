import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  bookingServiceHref,
  selectedVehicleFromSearch,
} from "../src/client/bookingVehicleSelection.ts";

const services = ["airport-transfer", "day-tour", "round-tour"];

test("selected vehicle is passed between all booking services", () => {
  for (const service of services) {
    const target = `/customer/booking/${service}`;
    assert.equal(bookingServiceHref(target, 12), `${target}?vehicle=12`);
    assert.equal(bookingServiceHref(target, "12"), `${target}?vehicle=12`);
    assert.equal(selectedVehicleFromSearch(`?vehicle=12`), 12);
  }
});

test("no vehicle selection does not create fake IDs in navigation", () => {
  assert.equal(bookingServiceHref("/customer/booking/day-tour", null), "/customer/booking/day-tour");
  assert.equal(bookingServiceHref("/customer/booking/day-tour", 0), "/customer/booking/day-tour");
  for (const invalid of ["", "-1", "1e4", "abc", "Infinity", "9007199254740992"]) {
    assert.equal(selectedVehicleFromSearch(`?vehicle=${encodeURIComponent(invalid)}`), null);
  }
  assert.equal(selectedVehicleFromSearch("?vehicle=5&vehicle=8"), 5);
});

test("all booking service pages pass their current selection to both switchers", () => {
  for (const service of services) {
    const page = readFileSync(`app/customer/booking/${service}/page.tsx`, "utf8");
    const value = service === "airport-transfer" ? "selectedVehicle" : "selectedVehicleId";
    assert.match(page, new RegExp(`<ServiceTabs active="${service}" vehicleId=\\{${value}\\}`));
    assert.match(page, new RegExp(`<ServiceColorDashes active="${service}" vehicleId=\\{${value}\\}`));
    assert.match(page, /selectedVehicleFromSearch\(window\.location\.search\)/);
    assert.match(page, /loadedVehicles\.find\(/);
  }
});
