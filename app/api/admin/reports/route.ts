import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await requireAdminUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const period = new URL(request.url).searchParams.get("period") || "";
  if (!/^\d{4}-\d{2}$/.test(period)) return NextResponse.json({ error: "Select a valid month." }, { status: 400 });
  const [year, month] = period.split("-").map(Number);
  if (month < 1 || month > 12) return NextResponse.json({ error: "Invalid month." }, { status: 400 });
  const current = `${year}-${String(month).padStart(2, "0")}`;
  const previous = new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 7);
  const bookings = await db.orm.public.Booking.all();
  const inMonth = (date: string, value: string) => String(date).slice(0, 7) === value;
  function calculate(value: string) {
    const rows = bookings.filter(row => inMonth(row.createdAt, value));
    const completed = rows.filter(row => row.status === "COMPLETED");
    const cancelled = rows.filter(row => row.status === "CANCELLED");
    const paid = rows.filter(row => row.paymentStatus === "PAID");
    return { total: rows.length, completed: completed.length, cancelled: cancelled.length,
      paidCount: paid.length, revenue: paid.reduce((sum, row) => sum + Number(row.totalAmount), 0),
      pending: rows.filter(row => row.paymentStatus !== "PAID" && row.status === "PENDING")
        .reduce((sum, row) => sum + Number(row.totalAmount), 0) };
  }
  return NextResponse.json({ current: calculate(current), previous: calculate(previous) });
}