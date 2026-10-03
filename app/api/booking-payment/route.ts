import { withApi } from "@/src/server/http/guard";
import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { receiptToken, verifyPaymentLink } from "@/src/server/bookingLinks";

export const runtime = "nodejs";

async function handleGET(request: Request) {
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
  return NextResponse.json({ confirmationToken: receiptToken(id, booking.bookingReference), booking: {
    id: booking.id, bookingReference: booking.bookingReference, serviceType: booking.serviceType,
    amount: Number(booking.totalAmount), currency: booking.currency,
    status: booking.status, paymentStatus: booking.paymentStatus,
  } });
}

async function handlePOST() {
  // A payment must be initiated by the contracted provider's signed hosted checkout.
  // Never accept card details or mark a booking paid from a browser request.
  return NextResponse.json({ error: "The payment gateway is not configured. Please contact Green Holiday Centre." }, { status: 503 });
}
export const GET = withApi(handleGET, "/api/booking-payment");

export const POST = withApi(handlePOST, "/api/booking-payment");
