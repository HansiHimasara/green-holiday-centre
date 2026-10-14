import test from "node:test";
import assert from "node:assert/strict";
import { calculateFare } from "../src/server/pricingFormula.ts";
const base = {
  serviceType: "DAY_TOUR", actualKilometres: 100, numberOfDays: 1,
  vehicleRatePerKm: 150, driverBattaPerDayLkr: 1800,
  lkrPerUsd: 300,
};
test("day tour includes 80 fixed kilometres, 20 each day, and private batta", () => {
  assert.deepEqual(calculateFare(base), { billableKilometres: 200, totalAmount: 105 });
});
test("round tour charges batta per day and 20 km per day", () => {
  const result = calculateFare({ ...base, serviceType: "ROUND_TOUR", numberOfDays: 3 });
  assert.equal(result.billableKilometres, 240);
  assert.equal(result.totalAmount, 140); // (240*150+3*1800)/300 = 138 => 140
});
test("airport transfer uses the same distance and daily batta formula", () => {
  assert.deepEqual(calculateFare({ ...base, serviceType: "AIRPORT_TRANSFER", actualKilometres: 10 }),
    { billableKilometres: 110, totalAmount: 60 });
});
test("USD prices round to the nearest multiple of five", () => {
  for (const distance of [1, 10, 25, 50, 100, 150, 200]) {
    assert.equal(calculateFare({ ...base, actualKilometres: distance }).totalAmount % 5, 0);
  }
  assert.equal(calculateFare({ ...base, vehicleRatePerKm: 165 }).totalAmount, 115);
});
test("unconfigured driver batta blocks all quoting and invalid days fail", () => {
  assert.throws(() => calculateFare({ ...base, driverBattaPerDayLkr: 0 }), /batta/);
  assert.throws(() => calculateFare({ ...base, numberOfDays: 0 }), /Invalid/);
  assert.throws(() => calculateFare({ ...base, lkrPerUsd: 0 }), /Invalid/);
});

test("rounds to closest five instead of always charging up", () => {
  // 200 km at Rs. 145/km + Rs. 1800 = Rs. 30800 / 300 = 102.67 => 105.
  assert.equal(calculateFare({ ...base, vehicleRatePerKm: 145 }).totalAmount, 105);
  // Rs. 146*200 + 1800 = Rs. 31000 / 300 = 103.33 => 105.
  assert.equal(calculateFare({ ...base, vehicleRatePerKm: 146 }).totalAmount, 105);
  // 200 km*150 + 1800 => USD 106, must round DOWN to USD 105.
  assert.equal(calculateFare(base).totalAmount, 105);
});
