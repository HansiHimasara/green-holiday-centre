import { NextResponse } from "next/server";

import {
  logoutCurrentUser,
} from "@/src/server/auth/session";

export const runtime = "nodejs";

export async function POST() {
  try {
    await logoutCurrentUser();

    return NextResponse.json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to log out.",
      },
      {
        status: 500,
      }
    );
  }
}