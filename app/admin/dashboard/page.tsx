import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./DashboardClient";

// Never cache one administrator's data in a public/shared cache.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminDashboardPage() {
  if (!(await requireAdminUser())) redirect("/admin/login");
  // Independent DB reads can execute concurrently. This is the first view's data,
  // so no browser-only useEffect fetching or self-HTTP API calls are needed.
  const [bookings, customers, vehicles] = await Promise.all([
    db.orm.public.Booking.all(),
    db.orm.public.Customer.all(),
    db.orm.public.VehicleType.all(),
  ]);
  const customerMap = new Map(customers.map(row => [row.id, row.fullName]));
  const vehicleMap = new Map(vehicles.map(row => [row.id, row.name]));
  const initialBookings = bookings.map(row => ({
    id: row.bookingReference,
    customer: customerMap.get(row.customerId) ?? "Unknown Customer",
    date: String(row.travelDate),
    vehicle: vehicleMap.get(row.vehicleTypeId) ?? "Unknown Vehicle",
    status: row.status.toLowerCase() as "confirmed" | "pending" | "cancelled" | "completed",
  }));
  const initialCustomers = customers.map(row => ({ createdAt: String(row.createdAt) }));
  return <AdminDashboardClient initialBookings={initialBookings} initialCustomers={initialCustomers} />;
}
