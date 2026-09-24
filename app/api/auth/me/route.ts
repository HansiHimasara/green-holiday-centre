import { NextResponse } from "next/server";

import {
  getCurrentUser,
} from "@/src/server/auth/session";

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