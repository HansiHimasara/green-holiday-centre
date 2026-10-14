import { withApi } from "@/src/server/http/guard";
import { NextResponse } from "next/server";

import {
  logoutCurrentUser,
} from "@/src/server/auth/session";

export const runtime = "nodejs";

async function handlePOST() {
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
export const POST = withApi(handlePOST, "/api/auth/logout");
