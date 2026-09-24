import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

function createPaymentReference() {
  return `PAY-${randomBytes(8)
    .toString("hex")
    .toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bookingId = Number(body.bookingId);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid booking.",
        },
        {
          status: 400,
        }
      );
    }

    // Find booking
    const booking = await db.orm.public.Booking
      .where({
        id: bookingId,
      })
      .first();

    if (!booking) {
      return NextResponse.json(
        {
          error: "Booking not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Check whether a payment already exists
    const existingPayment = await db.orm.public.Payment
      .where({
        bookingId,
      })
      .first();

    if (
      existingPayment &&
      (existingPayment.status === "PENDING" ||
        existingPayment.status === "PAID")
    ) {
      return NextResponse.json({
        message: "Payment already exists.",
        payment: {
          id: existingPayment.id,
          transactionReference:
            existingPayment.transactionReference,
          status: existingPayment.status,
          amount: existingPayment.amount,
          currency: existingPayment.currency,
        },
      });
    }

    const transactionReference = createPaymentReference();

    // Card number and CVV are intentionally NOT saved.
    const payment = await db.orm.public.Payment.create({
      bookingId,

      amount: String(booking.totalAmount),

      currency: booking.currency,

      paymentMethod: "CARD",

      status: "PENDING",

      transactionReference,
    });

    if (!payment) {
      return NextResponse.json(
        {
          error: "Unable to create payment.",
        },
        {
          status: 500,
        }
      );
    }

    const updatedBooking = await db.orm.public.Booking
      .where({
        id: bookingId,
      })
      .update({
        paymentStatus: "PENDING",
      });

    if (!updatedBooking) {
      return NextResponse.json(
        {
          error: "Unable to update booking payment status.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Payment request created successfully.",

        payment: {
          id: payment.id,

          transactionReference:
            payment.transactionReference,

          status: payment.status,

          amount: payment.amount,

          currency: payment.currency,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to process the payment request.",
      },
      {
        status: 500,
      }
    );
  }
}