import { withApi } from "@/src/server/http/guard";
import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

import {
  verifyPassword,
} from "@/src/server/auth/password";

import {
  createSession,
  logoutCurrentUser,
} from "@/src/server/auth/session";

export const runtime = "nodejs";

async function handlePOST(
  request: Request
) {
  try {
    const body = await request.json();

    const email = String(
      body.email ?? ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password ?? ""
    );

    const remember = Boolean(
      body.remember
    );

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email address and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const emailValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      );

    if (!emailValid) {
      return NextResponse.json(
        {
          error:
            "Enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await db.orm.public.User
        .where({
          email,
        })
        .first();

    if (!user || user.status !== "ACTIVE" || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json(
        {
          error:
            "Invalid email address or password.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordCorrect =
      await verifyPassword(
        password,
        user.passwordHash
      );

    if (!passwordCorrect) {
      return NextResponse.json(
        {
          error:
            "Invalid email address or password.",
        },
        {
          status: 401,
        }
      );
    }

    await db.orm.public.User
      .where({
        id: user.id,
      })
      .update({
        lastLoginAt:
          new Date().toISOString(),
      });

    await logoutCurrentUser();
    await createSession(
      user.id,
      remember
    );

    return NextResponse.json({
      message:
        "Login successful.",

      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to login.",
      },
      {
        status: 500,
      }
    );
  }
}
export const POST = withApi(handlePOST, "/api/auth/login");
