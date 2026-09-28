import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  // Business-data export. Database restore and automated offsite backups belong to
  // the database provider and must be configured separately for production.
  const [customers, vehicles, bookings, destinations, payments, feedback, contacts] = await Promise.all([
    db.orm.public.Customer.all(), db.orm.public.VehicleType.all(), db.orm.public.Booking.all(),
    db.orm.public.BookingDestination.all(), db.orm.public.Payment.all(),
    db.orm.public.Feedback.all(), db.orm.public.ContactMessage.all(),
  ]);
  const exportedAt = new Date().toISOString();
  return new Response(JSON.stringify({ exportedAt, customers, vehicles, bookings, destinations, payments, feedback, contacts }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="green-holiday-data-${exportedAt.slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}