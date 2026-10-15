import "dotenv/config";
import { db } from "../src/prisma/db";
const required = ["DATABASE_URL", "APP_BASE_URL", "BOOKING_LINK_SECRET", "OPENROUTESERVICE_API_KEY", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];
for (const name of required) console.log(`${name}: ${process.env[name] ? "configured" : "MISSING"}`);
const manual = Number(process.env.LKR_PER_USD);
const validManual = Boolean(process.env.LKR_PER_USD?.trim()) && Number.isFinite(manual) && manual > 0;
console.log(`Exchange rate: ${process.env.EXCHANGE_RATE_API_KEY?.trim() ? "API key configured" : validManual ? "manual LKR_PER_USD configured" : "MISSING"}`);
console.log(`Manual FX fallback: ${validManual ? "configured" : "not configured"}`);
try {
  // This real read also verifies the Prisma contract marker; it does not change data.
  await db.orm.public.User.first();
  console.log("Database connection and contract: OK");
  const vehicles = await db.orm.public.VehicleType.where({ status: "ACTIVE" }).all();
  const missingRates = vehicles.filter(v => !Number.isFinite(Number(v.ratePerKm)) || Number(v.ratePerKm) <= 0);
  const missingDriverBatta = vehicles.filter(v => !Number.isSafeInteger(Number(v.driverBattaPerDayLkr)) || Number(v.driverBattaPerDayLkr) <= 0);
  console.log(`Active vehicles: ${vehicles.length}`);
  for (const vehicle of missingRates) console.warn(`RATE MISSING: vehicle ${vehicle.id} (${vehicle.name}). Set its positive LKR/km rate in Admin > Vehicles.`);
  if (!missingRates.length) console.log("Active vehicle rates: OK");
  for (const vehicle of missingDriverBatta) console.warn(`DRIVER BATTA MISSING: vehicle ${vehicle.id} (${vehicle.name}). Set the positive LKR/day driver batta in Admin > Vehicles.`);
  process.exit(0);
} catch (error) {
  console.error("Database check failed. Verify DATABASE_URL, Supabase availability and network access; run npm run db:verify for contract details.");
  console.error(error instanceof Error ? error.message : "Unknown database error");
  process.exit(1);
}
