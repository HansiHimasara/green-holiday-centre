import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { hashPassword } from "@/src/server/auth/password";

export const runtime = "nodejs";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const token = String(
      body.token ?? ""
    );

    const password = String(
      body.password ?? ""
    );

    const confirmPassword = String(
      body.confirmPassword ?? ""
    );

    if (
      !token ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          error:
            "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      password !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          error:
            "Passwords do not match.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const tokenHash =
      createHash("sha256")
        .update(token)
        .digest("hex");

    const resetToken =
      await db.orm.public.PasswordResetToken
        .where({
          tokenHash,
        })
        .first();

    if (!resetToken) {
      return NextResponse.json(
        {
          error:
            "This password reset link is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    if (resetToken.usedAt) {
      return NextResponse.json(
        {
          error:
            "This password reset link has already been used.",
        },
        {
          status: 400,
        }
      );
    }

    const expired =
      new Date(
        resetToken.expiresAt
      ).getTime() <= Date.now();

    if (expired) {
      return NextResponse.json(
        {
          error:
            "This password reset link has expired.",
        },
        {
          status: 400,
        }
      );
    }

    const passwordHash =
      await hashPassword(password);

    await db.transaction(
      async (tx) => {
        // Save the new password
        await tx.orm.public.User
          .where({
            id: resetToken.userId,
          })
          .update({
            passwordHash,
          });

        // Mark the reset token as used
        await tx.orm.public.PasswordResetToken
          .where({
            id: resetToken.id,
          })
          .update({
            usedAt:
              new Date().toISOString(),
          });

        // Log out all old sessions
        await tx.orm.public.Session
          .where({
            userId:
              resetToken.userId,
          })
          .deleteAndCount();
      }
    );

    return NextResponse.json({
      message:
        "Password changed successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error(
      "PASSWORD RESET CONFIRM ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to reset password.",
      },
      {
        status: 500,
      }
    );
  }
}