import { test } from "node:test";
import assert from "node:assert/strict";
import { SRI_LANKAN_AIRPORTS, validAirportTransfer } from "../src/shared/airports";
test("airport endpoints must be canonical Sri Lankan airports", () => {
  for (const airport of SRI_LANKAN_AIRPORTS) {
    assert.equal(validAirportTransfer(airport, "Colombo Hotel"), true);
    assert.equal(validAirportTransfer("Colombo Hotel", airport), true);
    assert.equal(validAirportTransfer(airport, airport), false);
  }
  assert.equal(validAirportTransfer("Kandy", "Colombo"), false);
  assert.equal(validAirportTransfer("Fake International Airport", "Colombo"), false);
});
