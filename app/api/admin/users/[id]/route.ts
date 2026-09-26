import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { requireSuperAdmin } from "@/src/server/auth/session";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    // Only SUPER_ADMIN can delete Admin accounts
    const superAdmin =
      await requireSuperAdmin();

    if (!superAdmin) {
      return NextResponse.json(
        {
          error:
            "Only the Super Admin can delete administrator accounts.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } =
      await context.params;

    const adminId =
      Number(id);

    if (
      !Number.isInteger(adminId) ||
      adminId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid administrator ID.",
        },
        {
          status: 400,
        }
      );
    }

    // Find the selected account
    const user =
      await db.orm.public.User
        .where({
          id: adminId,
        })
        .first();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Administrator account not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Never allow SUPER_ADMIN deletion
    if (
      user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          error:
            "The Super Admin account cannot be deleted.",
        },
        {
          status: 403,
        }
      );
    }

    // Delete related data and Admin account together
    await db.transaction(
      async (tx) => {
        // Remove password reset tokens
        await tx.orm.public.PasswordResetToken
          .where({
            userId: adminId,
          })
          .deleteAndCount();

        // Remove login sessions
        await tx.orm.public.Session
          .where({
            userId: adminId,
          })
          .deleteAndCount();

        // Remove Admin from user table
        await tx.orm.public.User
          .where({
            id: adminId,
          })
          .deleteAndCount();
      }
    );

    return NextResponse.json({
      message:
        "Admin account deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE ADMIN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete administrator account.",
      },
      {
        status: 500,
      }
    );
  }
}