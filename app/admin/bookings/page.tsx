import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
import { redirect } from "next/navigation";
import AdminBookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminBookingsPage() {
  if (!(await requireAdminUser())) redirect("/admin/login");
  const [bookings, customers, vehicles] = await Promise.all([
    db.orm.public.Booking.all(),
    db.orm.public.Customer.all(),
    db.orm.public.VehicleType.all(),
  ]);
  const customerMap = new Map(customers.map(row => [row.id, row.fullName]));
  const vehicleMap = new Map(vehicles.map(row => [row.id, row.name]));
  const initialBookings = bookings.map(row => ({
    dbId: row.id,
    id: row.bookingReference,
    customer: customerMap.get(row.customerId) ?? "Unknown Customer",
    date: String(row.travelDate),
    vehicle: vehicleMap.get(row.vehicleTypeId) ?? "Unknown Vehicle",
    status: row.status.toLowerCase() as "confirmed" | "pending" | "cancelled" | "completed",
  })).sort((a, b) => b.dbId - a.dbId);
  return <AdminBookingsClient initialBookings={initialBookings} />;
}
