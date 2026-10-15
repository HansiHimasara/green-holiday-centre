import test from "node:test";
import assert from "node:assert/strict";
import { calculateBookingPrice } from "../src/server/bookingPricing";

test("quotes recover from Photon outage and never invent a distance", async () => {
  const previousFetch = globalThis.fetch;
  const previousEnv = { ...process.env };
  process.env.LKR_PER_USD = "300";
  delete process.env.EXCHANGE_RATE_API_KEY;
  process.env.OPENROUTESERVICE_API_KEY = "test-key";
  let fallbackWorks = true;
  let directions = 0;
  globalThis.fetch = async (input, options) => {
    const url = String(input);
    if (url.includes("photon.komoot.io")) throw new Error("Photon unavailable");
    if (url.includes("/geocode/search")) {
      assert.equal(new Headers(options?.headers).get("Authorization"), "test-key");
      assert.equal(new URL(url).searchParams.get("boundary.country"), "LKA");
      assert.ok(!url.includes("test-key"));
      return Response.json({ features: fallbackWorks ? [{ geometry: { coordinates: [79.8542, 6.9389] } }] : [] });
    }
    if (url.includes("/directions/")) {
      directions++;
      return Response.json({ features: [{ properties: { summary: { distance: 100000, duration: 7200 } } }] });
    }
    throw new Error("Unexpected request");
  };
  try {
    for (const serviceType of ["AIRPORT_TRANSFER", "DAY_TOUR", "ROUND_TOUR"] as const) {
      const result = await calculateBookingPrice({
        serviceType,
        pickupLocation: "Bandaranaike International Airport, Katunayake, Sri Lanka",
        dropoffLocation: "Colombo, Sri Lanka", waypoints: ["Kandy, Sri Lanka"],
        vehicleRatePerKm: 90, driverBattaPerDayLkr: 5500,
        numberOfDays: serviceType === "ROUND_TOUR" ? 2 : 1,
      });
      assert.equal(result.totalAmount, serviceType === "ROUND_TOUR" ? 105 : 80);
      assert.equal(result.currency, "USD");
    }
    fallbackWorks = false;
    await assert.rejects(calculateBookingPrice({
      serviceType: "DAY_TOUR", pickupLocation: "Colombo", dropoffLocation: "Colombo",
      waypoints: ["Kandy"], vehicleRatePerKm: 90, driverBattaPerDayLkr: 5500,
    }), /Unable to locate/);
    assert.equal(directions, 3);
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of ["LKR_PER_USD", "EXCHANGE_RATE_API_KEY", "OPENROUTESERVICE_API_KEY"]) {
      if (previousEnv[key] === undefined) delete process.env[key];
      else process.env[key] = previousEnv[key];
    }
  }
});
