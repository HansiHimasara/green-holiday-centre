import { withApi } from "@/src/server/http/guard";
import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { hashPassword } from "@/src/server/auth/password";

export const runtime = "nodejs";

async function handlePOST(
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
        // Claim once inside the transaction; concurrent reuse must not change a password.
        const claimed = await tx.orm.public.PasswordResetToken
          .where({ id: resetToken.id, usedAt: null })
          .update({ usedAt: new Date().toISOString() });
        if (!claimed || new Date(claimed.expiresAt).getTime() <= Date.now()) {
          throw new Error("Reset token is expired or already used.");
        }
        const activeUser = await tx.orm.public.User.where({ id: resetToken.userId, status: "ACTIVE" }).first();
        if (!activeUser) throw new Error("Account unavailable.");
        // Save the new password
        await tx.orm.public.User
          .where({
            id: resetToken.userId,
          })
          .update({
            passwordHash,
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
export const POST = withApi(handlePOST, "/api/auth/password-reset/confirm");
