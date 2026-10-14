import { db } from "@/src/prisma/db";

export function vehicleCategory(name: string): "Sedan" | "SUV" | "Bus" | "Other" {
  if (/sedan|saloon/i.test(name)) return "Sedan";
  if (/suv|jeep|4x4/i.test(name)) return "SUV";
  if (/bus|coach|minibus/i.test(name)) return "Bus";
  return "Other";
}

export async function activeVehicles() {
  const rows = await db.orm.public.VehicleType.where({ status: "ACTIVE" }).all();
  return rows.sort((a, b) => a.id - b.id);
}