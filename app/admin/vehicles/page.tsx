import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
import { redirect } from "next/navigation";
import AdminVehiclesClient from "./VehiclesClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminVehiclesPage() {
  if (!(await requireAdminUser())) redirect("/admin/login");
  const rows = await db.orm.public.VehicleType.all();
  const initialVehicles = rows.map(row => ({
    dbId: row.id,
    id: `VH-${String(row.id).padStart(3, "0")}`,
    model: row.name,
    passengers: row.passengerCapacity,
    luggage: row.luggageCapacity,
    transmission: row.transmission ?? "",
    fuelType: row.fuelType ?? "",
    description: row.description ?? "",
    status: row.status.toLowerCase() as "active" | "inactive",
    rate: `Rs. ${row.ratePerKm}/km`,
    driverBattaPerDayLkr: row.driverBattaPerDayLkr,
    imageUrl: row.imageUrl ?? "",
  })).sort((a, b) => (a.dbId ?? 0) - (b.dbId ?? 0));
  return <AdminVehiclesClient initialVehicles={initialVehicles} />;
}
