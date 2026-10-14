import test from "node:test";
import assert from "node:assert/strict";
import { calculateFare } from "../src/server/pricingFormula.ts";
const base = {
  serviceType: "DAY_TOUR", actualKilometres: 100, numberOfDays: 1,
  vehicleRatePerKm: 150, driverBattaPerDayLkr: 1800,
  lkrPerUsd: 300,
};
test("day tour includes 80 fixed kilometres, 20 each day, and private batta", () => {
  assert.deepEqual(calculateFare(base), { billableKilometres: 200, totalAmount: 110 });
});
test("round tour charges batta per day and 20 km per day", () => {
  const result = calculateFare({ ...base, serviceType: "ROUND_TOUR", numberOfDays: 3 });
  assert.equal(result.billableKilometres, 240);
  assert.equal(result.totalAmount, 140); // (240*150+3*1800)/300 = 138 => 140
});
test("airport transfer uses the same distance and daily batta formula", () => {
  assert.deepEqual(calculateFare({ ...base, serviceType: "AIRPORT_TRANSFER", actualKilometres: 10 }),
    { billableKilometres: 110, totalAmount: 65 });
});
test("USD prices always round UP to a multiple of five", () => {
  for (const distance of [1, 10, 25, 50, 100, 150, 200]) {
    assert.equal(calculateFare({ ...base, actualKilometres: distance }).totalAmount % 5, 0);
  }
  assert.equal(calculateFare({ ...base, vehicleRatePerKm: 165 }).totalAmount, 120);
});
test("unconfigured driver batta blocks all quoting and invalid days fail", () => {
  assert.throws(() => calculateFare({ ...base, driverBattaPerDayLkr: 0 }), /batta/);
  assert.throws(() => calculateFare({ ...base, numberOfDays: 0 }), /Invalid/);
  assert.throws(() => calculateFare({ ...base, lkrPerUsd: 0 }), /Invalid/);
});
