import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { readRating } from "@/src/server/feedback";

export const runtime = "nodejs";

/* Public: a customer submits feedback */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName ?? "").trim();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const bookingReference = String(body.bookingReference ?? "")
      .trim()
      .toUpperCase();

    const message = String(body.message ?? "").trim();

    const rating = readRating(body.rating);

    if (!fullName || !message) {
      return NextResponse.json(
        { error: "Please enter your name and your feedback." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (rating === null) {
      return NextResponse.json(
        { error: "Please choose a rating between 1 and 5." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Feedback must be 2000 characters or less." },
        { status: 400 }
      );
    }

    let bookingId: number | null = null;
    let customerId: number | null = null;

    // Optionally link the feedback to a booking
    if (bookingReference) {
      const booking = await db.orm.public.Booking
        .where({ bookingReference })
        .first();

      if (!booking) {
        return NextResponse.json(
          { error: "Booking reference was not found." },
          { status: 404 }
        );
      }

      const existing = await db.orm.public.Feedback
        .where({ bookingId: booking.id })
        .first();

      if (existing) {
        return NextResponse.json(
          { error: "Feedback has already been submitted for this booking." },
          { status: 409 }
        );
      }

      bookingId = booking.id;
      customerId = booking.customerId;
    }

    const feedback = await db.orm.public.Feedback.create({
      fullName,
      email: email || null,
      rating,
      message,
      bookingId,
      customerId,
      visibility: "VISIBLE",
    });

    return NextResponse.json(
      {
        message: "Thank you! Your feedback has been submitted.",
        feedback: { id: feedback.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SUBMIT FEEDBACK ERROR:", error);

    return NextResponse.json(
      { error: "Unable to submit feedback. Please try again." },
      { status: 500 }
    );
  }
}
