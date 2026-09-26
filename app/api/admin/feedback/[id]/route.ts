import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
import { readRating, toAdminFeedback } from "@/src/server/feedback";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function readId(context: RouteContext) {
  const { id } = await context.params;
  const feedbackId = Number(id);

  return Number.isInteger(feedbackId) && feedbackId > 0
    ? feedbackId
    : null;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await requireAdminUser())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const feedbackId = await readId(context);

    if (!feedbackId) {
      return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
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

    const updated = await db.orm.public.Feedback
      .where({ id: feedbackId })
      .update({
        fullName: customer,
        rating,
        message,
        visibility: body.status === "hidden" ? "HIDDEN" : "VISIBLE",
      });

    if (!updated) {
      return NextResponse.json(
        { error: "Feedback not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Feedback updated successfully.",
      feedback: toAdminFeedback(updated),
    });
  } catch (error) {
    console.error("ADMIN FEEDBACK UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update feedback." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    if (!(await requireAdminUser())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const feedbackId = await readId(context);

    if (!feedbackId) {
      return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
    }

    const deletedCount = await db.orm.public.Feedback
      .where({ id: feedbackId })
      .deleteAndCount();

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: "Feedback not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Feedback deleted successfully." });
  } catch (error) {
    console.error("ADMIN FEEDBACK DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to delete feedback." },
      { status: 500 }
    );
  }
}
