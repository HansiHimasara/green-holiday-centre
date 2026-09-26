import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
import { readRating, toAdminFeedback } from "@/src/server/feedback";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!(await requireAdminUser())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const rows = await db.orm.public.Feedback.all();

    const feedback = rows
      .map(toAdminFeedback)
      .sort((a, b) => b.id - a.id);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("ADMIN FEEDBACK LIST ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load feedback." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdminUser())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    const customer = String(body.customer ?? "").trim();
    const message = String(body.feedback ?? "").trim();
    const rating = readRating(body.rating);

    if (!customer || !message || rating === null) {
      return NextResponse.json(
        { error: "Customer name, feedback and a 1-5 rating are required." },
        { status: 400 }
      );
    }

    const created = await db.orm.public.Feedback.create({
      fullName: customer,
      email: null,
      rating,
      message,
      bookingId: null,
      customerId: null,
      visibility: body.status === "hidden" ? "HIDDEN" : "VISIBLE",
    });

    return NextResponse.json(
      {
        message: "Feedback created successfully.",
        feedback: toAdminFeedback(created),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN FEEDBACK CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to create feedback." },
      { status: 500 }
    );
  }
}
