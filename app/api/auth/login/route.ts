import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

import {
  verifyPassword,
} from "@/src/server/auth/password";

import {
  createSession,
} from "@/src/server/auth/session";

export const runtime = "nodejs";

export async function POST(
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

    if (!user) {
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

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error:
            "This account is disabled.",
        },
        {
          status: 403,
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