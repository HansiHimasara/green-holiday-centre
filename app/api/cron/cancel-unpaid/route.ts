import { withApi } from "@/src/server/http/guard";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

async function handlePOST(request: Request) {
  const key = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!key || Buffer.byteLength(supplied) !== Buffer.byteLength(key) || !timingSafeEqual(Buffer.from(key), Buffer.from(supplied))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  // Calendar dates are evaluated in Sri Lanka, independently of the server time zone.
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date()).map(({ type, value }) => [type, value]));
  const cutoff = new Date(Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day) + 3)).toISOString().slice(0, 10);
  const bookings = await db.orm.public.Booking.where({ status: "PENDING" }).all();
  let cancelled = 0;
  for (const booking of bookings) {
    if (booking.paymentStatus !== "PAID" && booking.travelDate <= cutoff) {
      const updated = await db.orm.public.Booking.where({ id: booking.id, status: "PENDING", paymentStatus: booking.paymentStatus }).update({ status: "CANCELLED" });
      if (updated) cancelled++;
    }
  }
  return NextResponse.json({ cancelled });
}
export const POST = withApi(handlePOST, "/api/cron/cancel-unpaid");
