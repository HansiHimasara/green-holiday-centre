import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

/* Public: contact form message */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const phone = String(body.phone ?? "").trim();

    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please enter your name, email and message." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be 5000 characters or less." },
        { status: 400 }
      );
    }

    const saved = await db.orm.public.ContactMessage.create({
      name,
      email,
      phone: phone || null,
      message,
    });

    return NextResponse.json(
      {
        message: "Thank you! We will get back to you soon.",
        contact: { id: saved.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CONTACT MESSAGE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 500 }
    );
  }
}
