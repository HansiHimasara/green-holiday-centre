import { db } from "@/src/prisma/db";

export function vehicleCategory(name: string): "Sedan" | "SUV" | "Bus" | "Other" {
  if (/sedan|saloon/i.test(name)) return "Sedan";
  if (/suv|jeep|4x4/i.test(name)) return "SUV";
  if (/bus|coach|minibus/i.test(name)) return "Bus";
  return "Other";
}

// Public fleet pages show inactive vehicles as unavailable rather than hiding them.
// Booking selection endpoints continue to return ACTIVE vehicles only.
export async function publicFleetVehicles() {
  const rows = await db.orm.public.VehicleType.all();
  return rows.sort((a, b) => a.id - b.id);
}

export async function activeVehicles() {
  const rows = await db.orm.public.VehicleType.where({ status: "ACTIVE" }).all();
  return rows.sort((a, b) => a.id - b.id);
}