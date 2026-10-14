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

// Valid scrypt fixture, never associated with any account. Keeps unknown-account
// and disabled-account logins from skipping the expensive password check.
const DUMMY_PASSWORD_HASH =
  "scrypt$16384$8$1$00000000000000000000000000000000$b57d5ca40054af3629f6069c0de68f04323986ea387354e9c5ccdcd28dff6497ba0942c3d73b49c474c0e0207bb4e1d45c222b2f967f6b820a99e4f5d9920db4";

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
      await verifyPassword(password, DUMMY_PASSWORD_HASH);
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
