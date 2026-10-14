import { readProfilePhoto } from "@/src/server/http/profilePhoto";
import { withApi } from "@/src/server/http/guard";
import { NextResponse } from "next/server";

import {
  getCurrentUser,
} from "@/src/server/auth/session";
import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

async function handleGET() {
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

async function handlePATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json();
  const hasPhoto = Object.hasOwn(body, "photo");
  const hasDetails = ["fullName", "username", "email", "phone"].some((field) => Object.hasOwn(body, field));
  if (!hasPhoto && !hasDetails) {
    return NextResponse.json({ error: "Choose a photo or enter your profile details." }, { status: 400 });
  }

  let details: { fullName: string; username: string; email: string; phone: string } | undefined;
  if (hasDetails) {
    const fullName = String(body.fullName ?? "").trim();
    const username = String(body.username ?? "").trim().toLowerCase();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    if (!fullName || !username || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) {
      return NextResponse.json({ error: "Enter a name, username, valid email and phone number." }, { status: 400 });
    }
    details = { fullName, username, email, phone };
  }

  const photo = hasPhoto ? { profileImageUrl: readProfilePhoto(body.photo) } : {};
  try {
    const updated = await db.orm.public.User.where({ id: user.id }).update({ ...details, ...photo });
    if (!updated) return NextResponse.json({ error: "Account not found." }, { status: 404 });
    return NextResponse.json({ user: {
      id: updated.id, fullName: updated.fullName, username: updated.username,
      email: updated.email, phone: updated.phone, role: updated.role,
      status: updated.status, profileImageUrl: updated.profileImageUrl,
      lastLoginAt: updated.lastLoginAt,
    } });
  } catch {
    return NextResponse.json({ error: "The username or email may already be in use." }, { status: 409 });
  }
}
export const GET = withApi(handleGET, "/api/auth/me");

export const PATCH = withApi(handlePATCH, "/api/auth/me");
