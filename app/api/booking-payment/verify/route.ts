import { db } from "@/src/prisma/db";
import { receiptToken, verifyReceiptToken } from "@/src/server/bookingLinks";
import { withApi, consumeLimit, trustedClientIp } from "@/src/server/http/guard";
import { GatewayError, checkCapturedOrder, retrieveGatewayOrder } from "@/src/server/mpgs";
import { isRecord } from "@/src/server/http/validation";

export const runtime = "nodejs";

async function handlePOST(request: Request) {
  let input: unknown;
  try { input = await request.json(); } catch { return Response.json({ error: "Invalid verification request." }, { status: 400 }); }
  if (!isRecord(input) || !Number.isSafeInteger(input.booking) || Number(input.booking) < 1 ||
      typeof input.token !== "string" || typeof input.orderId !== "string" ||
      Object.keys(input).some(key => !["booking", "token", "orderId"].includes(key)) ||
      !/^GHC-[0-9]+-[A-F0-9]{24}$/.test(input.orderId)) {
    return Response.json({ error: "Invalid payment verification details." }, { status: 400 });
  }
  const id = input.booking as number;
  const token = input.token as string;
  const orderId = input.orderId as string;
  const booking = await db.orm.public.Booking.where({ id }).first();
  if (!booking || !verifyReceiptToken(id, booking.bookingReference, token)) {
    return Response.json({ error: "Invalid payment verification link." }, { status: 403 });
  }
  const payment = await db.orm.public.Payment.where({ bookingId: id, transactionReference: orderId }).first();
  if (!payment) return Response.json({ error: "Payment attempt was not found." }, { status: 404 });
  const ip = trustedClientIp(request);
  if (ip) consumeLimit(`/api/booking-payment/verify:ip:${ip}`, 30);
  consumeLimit(`/api/booking-payment/verify:booking:${id}`, 40);
  const confirmationUrl = `/customer/booking/confirmation?${new URLSearchParams({ booking: String(id), token: receiptToken(id, booking.bookingReference) })}`;
  if (payment.status === "PAID") return Response.json({ status: "PAID", confirmationUrl });

  try {
    // NEVER trust query-string resultIndicator or a paymentStatus supplied by the browser.
    const gatewayOrder = await retrieveGatewayOrder(orderId);
    const status = checkCapturedOrder(gatewayOrder, orderId, Number(payment.amount).toFixed(2), payment.currency);
    if (status === "PAID") {
      // Idempotent updates. The booking's approval state is a separate admin decision.
      await db.transaction(async tx => {
        await tx.orm.public.Payment.where({ bookingId: id, transactionReference: orderId, status: "PENDING" })
          .update({ status: "PAID", paidAt: new Date().toISOString() });
        await tx.orm.public.Booking.where({ id }).update({ paymentStatus: "PAID" });
      });
    } else if (status === "FAILED") {
      await db.orm.public.Payment.where({ bookingId: id, transactionReference: orderId, status: "PENDING" }).update({ status: "FAILED" });
      await db.orm.public.Booking.where({ id, paymentStatus: "PENDING" }).update({ paymentStatus: "FAILED" });
    }
    return Response.json({ status, confirmationUrl });
  } catch (error) {
    if (!(error instanceof GatewayError)) console.error("Payment verification failed", error);
    return Response.json({ error: error instanceof GatewayError ? error.message : "Payment verification is temporarily unavailable. Please try again." },
      { status: error instanceof GatewayError ? error.status : 503 });
  }
}
export const POST = withApi(handlePOST, "/api/booking-payment/verify");
