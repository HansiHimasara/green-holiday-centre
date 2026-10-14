/** Private LKR costs; only the USD total is returned to customers. */
export type PricingServiceType = "AIRPORT_TRANSFER" | "DAY_TOUR" | "ROUND_TOUR";

export type PriceFormulaInput = {
  serviceType: PricingServiceType;
  actualKilometres: number;
  numberOfDays: number;
  vehicleRatePerKm: number;
  driverBattaPerDayLkr: number;
  lkrPerUsd: number;
};

export function calculateFare(input: PriceFormulaInput) {
  const {
    actualKilometres, numberOfDays, vehicleRatePerKm,
    driverBattaPerDayLkr, lkrPerUsd,
  } = input;
  if (!Number.isFinite(actualKilometres) || actualKilometres <= 0 ||
      !Number.isInteger(numberOfDays) || numberOfDays < 1 || numberOfDays > 31 ||
      !Number.isFinite(vehicleRatePerKm) || vehicleRatePerKm <= 0 ||
      !Number.isFinite(lkrPerUsd) || lkrPerUsd <= 0) {
    throw new Error("Invalid distance, duration, exchange rate, or vehicle rate.");
  }

  if (!Number.isSafeInteger(driverBattaPerDayLkr) || driverBattaPerDayLkr <= 0) {
    throw new Error("Please configure a positive daily driver batta for this vehicle in the admin panel.");
  }
  // All services: 80 fixed km + actual map km + 20 km per day.
  // Charge kilometres at the private per-vehicle LKR/km rate, plus a private
  // vehicle-specific daily driver/guide batta (also in LKR).
  const billableKilometres = 80 + actualKilometres + 20 * numberOfDays;
  const totalLkr = billableKilometres * vehicleRatePerKm +
    numberOfDays * driverBattaPerDayLkr;
  const rawUsd = totalLkr / lkrPerUsd;
  // Round to the nearest USD 5 as specified by the fare policy.
  // EPSILON avoids floating-point drift at exact half-step boundaries.
  const totalAmount = Math.round(rawUsd / 5 + Number.EPSILON) * 5;
  if (!Number.isFinite(totalAmount) || totalAmount <= 0 || totalAmount > 99999999.99) {
    throw new Error("The calculated price is outside the supported range.");
  }
  return { billableKilometres, totalAmount };
}
