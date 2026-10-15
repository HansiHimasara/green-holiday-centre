import { timingSafeEqual } from "node:crypto";
import { db } from "@/src/prisma/db";
import { withApi } from "@/src/server/http/guard";
import { checkCapturedOrder, retrieveGatewayOrder } from "@/src/server/mpgs";

export const runtime = "nodejs";

async function handlePOST(request: Request) {
  const key = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!key || Buffer.byteLength(supplied) !== Buffer.byteLength(key) ||
      !timingSafeEqual(Buffer.from(key), Buffer.from(supplied))) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const pending = (await db.orm.public.Payment.where({ status: "PENDING" }).all()).slice(0, 30);
  let paid = 0;
  let failed = 0;
  let unresolved = 0;
  for (const payment of pending) {
    if (!payment.transactionReference) { unresolved++; continue; }
    try {
      const order = await retrieveGatewayOrder(payment.transactionReference);
      const state = checkCapturedOrder(order, payment.transactionReference,
        Number(payment.amount).toFixed(2), payment.currency);
      if (state === "PAID") {
        await db.transaction(async tx => {
          await tx.orm.public.Payment.where({ id: payment.id, status: "PENDING" })
            .update({ status: "PAID", paidAt: new Date().toISOString() });
          await tx.orm.public.Booking.where({ id: payment.bookingId }).update({ paymentStatus: "PAID" });
        });
        paid++;
      } else if (state === "FAILED") {
        await db.orm.public.Payment.where({ id: payment.id, status: "PENDING" }).update({ status: "FAILED" });
        await db.orm.public.Booking.where({ id: payment.bookingId, paymentStatus: "PENDING" })
          .update({ paymentStatus: "FAILED" });
        failed++;
      } else unresolved++;
    } catch {
      // Network errors or gateway mismatches must never be interpreted as failed payments.
      unresolved++;
    }
  }
  return Response.json({ checked: pending.length, paid, failed, unresolved });
}

export const POST = withApi(handlePOST, "/api/cron/reconcile-payments");
