import {
  createHash,
  randomBytes,
} from "node:crypto";

import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { sendPasswordResetEmail } from "@/src/server/email/passwordReset";

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

    // Check email
    if (!email) {
      return NextResponse.json(
        {
          error:
            "Email address is required.",
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

    // Find administrator account
    const user =
      await db.orm.public.User
        .where({
          email,
        })
        .first();

    // Return the same message even when the email does not exist
    if (!user) {
      return NextResponse.json({
        message:
          "If an administrator account exists for this email, a password reset link has been sent.",
      });
    }

    // Only active administrator accounts can reset passwords
    if (user.status !== "ACTIVE") {
      return NextResponse.json({
        message:
          "If an administrator account exists for this email, a password reset link has been sent.",
      });
    }

    // Remove previous reset tokens
    await db.orm.public.PasswordResetToken
      .where({
        userId: user.id,
      })
      .deleteAndCount();

    // Create secure reset token
    const rawToken =
      randomBytes(32).toString(
        "base64url"
      );

    const tokenHash =
      createHash("sha256")
        .update(rawToken)
        .digest("hex");

    // Reset link is valid for 30 minutes
    const expiresAt =
      new Date(
        Date.now() +
          30 * 60 * 1000
      );

    // Save only the hashed token in the database
    await db.orm.public.PasswordResetToken.create({
      userId: user.id,
      tokenHash,
      expiresAt:
        expiresAt.toISOString(),
      usedAt: null,
    });

    const appUrl =
      process.env.APP_URL ||
      "http://localhost:3000";

    const resetLink =
      `${appUrl}/admin/login?reset=${rawToken}`;

    // Send reset link to the administrator email
    await sendPasswordResetEmail(
      user.email,
      resetLink
    );

    return NextResponse.json({
      message:
        "Password reset link sent. Please check your email.",
    });
  } catch (error) {
    console.error(
      "PASSWORD RESET REQUEST ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to send password reset email.",
      },
      {
        status: 500,
      }
    );
  }
}