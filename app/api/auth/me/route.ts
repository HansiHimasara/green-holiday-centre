import { NextResponse } from "next/server";

import {
  getCurrentUser,
} from "@/src/server/auth/session";
import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Not authenticated.",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        profileImageUrl: user.profileImageUrl,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error(
      "GET CURRENT USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to get current user.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json();
  const fullName = String(body.fullName ?? "").trim();
  const username = String(body.username ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  if (!fullName || !username || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) {
    return NextResponse.json({ error: "Enter a name, username, valid email and phone number." }, { status: 400 });
  }
  try {
    const updated = await db.orm.public.User.where({ id: user.id }).update({ fullName, username, email, phone });
    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "The username or email may already be in use." }, { status: 409 });
  }
}