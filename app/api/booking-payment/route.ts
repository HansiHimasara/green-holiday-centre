import { randomBytes } from "node:crypto";
import { withApi, consumeLimit, trustedClientIp } from "@/src/server/http/guard";
import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { receiptToken, verifyPaymentLink, verifyReceiptToken } from "@/src/server/bookingLinks";
import { GatewayError, gatewayConfig, initiateHostedCheckout } from "@/src/server/mpgs";
import { isRecord } from "@/src/server/http/validation";

export const runtime = "nodejs";

async function authorizedBooking(id: number, token: string) {
  if (!Number.isSafeInteger(id) || id < 1 || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const booking = await db.orm.public.Booking.where({ id }).first();
  if (!booking) return null;
  if (verifyReceiptToken(id, booking.bookingReference, token)) return booking;
  const customer = await db.orm.public.Customer.where({ id: booking.customerId }).first();
  return customer && verifyPaymentLink(id, customer.email, token) ? booking : null;
}

async function handleGET(request: Request) {
  const params = new URL(request.url).searchParams;
  const id = Number(params.get("booking"));
  const token = params.get("token") || "";
  const booking = await authorizedBooking(id, token);
  if (!booking) return NextResponse.json({ error: "Invalid booking payment link." }, { status: 403 });
  return NextResponse.json({ confirmationToken: receiptToken(id, booking.bookingReference), booking: {
    id: booking.id, bookingReference: booking.bookingReference, serviceType: booking.serviceType,
    amount: Number(booking.totalAmount), currency: booking.currency, status: booking.status,
    paymentStatus: booking.paymentStatus,
  } });
}

async function handlePOST(request: Request) {
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid payment request." }, { status: 400 }); }
  if (!isRecord(input) || Object.keys(input).some(key => !["booking", "token"].includes(key)) ||
      !Number.isSafeInteger(input.booking) || typeof input.token !== "string") {
    return NextResponse.json({ error: "Only a booking ID and payment token are accepted." }, { status: 400 });
  }
  const id = input.booking as number;
  const booking = await authorizedBooking(id, input.token);
  if (!booking) return NextResponse.json({ error: "Invalid booking payment link." }, { status: 403 });
  const ip = trustedClientIp(request);
  if (ip) consumeLimit(`/api/booking-payment:ip:${ip}`, 20);
  consumeLimit(`/api/booking-payment:booking:${id}`, 12);
  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    return NextResponse.json({ error: "This booking cannot accept another payment." }, { status: 409 });
  }
  if (booking.paymentStatus === "PAID") return NextResponse.json({ error: "This booking has already been paid." }, { status: 409 });
  const outstanding = await db.orm.public.Payment.where({ bookingId: id, status: "PENDING" }).all();
  if (outstanding.length) {
    return NextResponse.json({ error: "An earlier bank checkout is still pending. Please check its result or contact our team before starting another payment." }, { status: 409 });
  }
  if (booking.currency !== "USD" || !Number.isFinite(Number(booking.totalAmount)) || Number(booking.totalAmount) <= 0) {
    return NextResponse.json({ error: "The booking payment amount is invalid." }, { status: 409 });
  }
  try {
    const config = gatewayConfig(); // check configuration before making a Payment record
    const orderId = `GHC-${id}-${randomBytes(12).toString("hex").toUpperCase()}`;
    const returnUrl = new URL("/customer/booking/payment/result", config.appBaseUrl);
    returnUrl.searchParams.set("booking", String(id));
    returnUrl.searchParams.set("token", receiptToken(id, booking.bookingReference));
    returnUrl.searchParams.set("order", orderId);
    const customer = await db.orm.public.Customer.where({ id: booking.customerId }).first();
    const email = booking.customerEmail || customer?.email;
    if (!email) return NextResponse.json({ error: "Booking email is missing." }, { status: 409 });
    const amount = Number(booking.totalAmount).toFixed(2);
    // Atomic claim: two simultaneous tabs cannot open two bank checkouts for one booking.
    await db.transaction(async tx => {
      const claimed = await tx.orm.public.Booking.where({ id, paymentStatus: booking.paymentStatus })
        .update({ paymentStatus: "PENDING" });
      if (!claimed) throw new GatewayError("Another payment has already started. Please check its status first.", 409);
      await tx.orm.public.Payment.create({ bookingId: id, transactionReference: orderId,
        amount, currency: "USD", status: "PENDING", paymentMethod: "MPGS_HOSTED_CHECKOUT" });
    });
    try {
      return NextResponse.json(await initiateHostedCheckout({ orderId, amount, currency: "USD", email, returnUrl: returnUrl.toString() }));
    } catch (error) {
      await db.transaction(async tx => {
        await tx.orm.public.Payment.where({ bookingId: id, transactionReference: orderId, status: "PENDING" }).update({ status: "FAILED" });
        await tx.orm.public.Booking.where({ id, paymentStatus: "PENDING" }).update({ paymentStatus: "FAILED" });
      });
      throw error;
    }
  } catch (error) {
    if (!(error instanceof GatewayError)) console.error("MPGS session initiation failed", error);
    return NextResponse.json({ error: error instanceof GatewayError ? error.message : "Unable to create a payment session." },
      { status: error instanceof GatewayError ? error.status : 503 });
  }
}
export const GET = withApi(handleGET, "/api/booking-payment");
export const POST = withApi(handlePOST, "/api/booking-payment");
