import { withApi } from "@/src/server/http/guard";
import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { requireSuperAdmin } from "@/src/server/auth/session";

export const runtime = "nodejs";

async function handleGET() {
  if (!(await requireSuperAdmin())) return NextResponse.json({ error: "Only the Super Admin may export personal booking records." }, { status: 403 });
  // Business-data export. Database restore and automated offsite backups belong to
  // the database provider and must be configured separately for production.
  // Keep the export queries sequential. The disposable PGlite integration server
  // and small production PostgreSQL pools may have fewer connections than the
  // seven concurrent reads used previously (which caused a 10-second pool
  // acquisition timeout and a 503 response).
  const customers = await db.orm.public.Customer.all();
  const vehicles = await db.orm.public.VehicleType.all();
  const bookings = await db.orm.public.Booking.all();
  const destinations = await db.orm.public.BookingDestination.all();
  const payments = await db.orm.public.Payment.all();
  const feedback = await db.orm.public.Feedback.all();
  const contacts = await db.orm.public.ContactMessage.all();
  const exportedAt = new Date().toISOString();
  return new Response(JSON.stringify({ exportedAt, customers, vehicles, bookings, destinations, payments, feedback, contacts }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="green-holiday-data-${exportedAt.slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
export const GET = withApi(handleGET, "/api/admin/backup");
