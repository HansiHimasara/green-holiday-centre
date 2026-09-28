import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { verifyPaymentLink } from "@/src/server/bookingLinks";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("booking"));
  const token = url.searchParams.get("token") || "";
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid booking." }, { status: 400 });
  const booking = await db.orm.public.Booking.where({ id }).first();
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  const customer = await db.orm.public.Customer.where({ id: booking.customerId }).first();
  if (!customer || !verifyPaymentLink(id, customer.email, token)) {
    return NextResponse.json({ error: "Invalid payment link." }, { status: 403 });
  }
  return NextResponse.json({ booking: {
    id: booking.id, bookingReference: booking.bookingReference,
    amount: Number(booking.totalAmount), currency: booking.currency,
    status: booking.status, paymentStatus: booking.paymentStatus,
  } });
}

export async function POST() {
  // A payment must be initiated by the contracted provider's signed hosted checkout.
  // Never accept card details or mark a booking paid from a browser request.
  return NextResponse.json({ error: "The payment gateway is not configured. Please contact Green Holiday Centre." }, { status: 503 });
}