import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { hashPassword } from "@/src/server/auth/password";
import { requireSuperAdmin } from "@/src/server/auth/session";

export const runtime = "nodejs";

// Get all normal Admin accounts
export async function GET() {
  try {
    // Only SUPER_ADMIN can view Admin accounts
    const superAdmin =
      await requireSuperAdmin();

    if (!superAdmin) {
      return NextResponse.json(
        {
          error:
            "Only the Super Admin can view administrator accounts.",
        },
        {
          status: 403,
        }
      );
    }

    const admins =
      await db.orm.public.User
        .where({
          role: "ADMIN",
        })
        .all();

    const adminList = admins
      .map((admin) => ({
        id: admin.id,
        fullName: admin.fullName,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt,
        lastLoginAt: admin.lastLoginAt,
      }))
      .sort(
        (a, b) =>
          new Date(
            String(b.createdAt)
          ).getTime() -
          new Date(
            String(a.createdAt)
          ).getTime()
      );

    return NextResponse.json({
      admins: adminList,
    });
  } catch (error) {
    console.error(
      "GET ADMINS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load administrator accounts.",
      },
      {
        status: 500,
      }
    );
  }
}

// Create a new normal Admin account
export async function POST(
  request: Request
) {
  try {
    // Only SUPER_ADMIN can create admins
    const superAdmin =
      await requireSuperAdmin();

    if (!superAdmin) {
      return NextResponse.json(
        {
          error:
            "Only the Super Admin can create administrator accounts.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const fullName = String(
      body.fullName ?? ""
    ).trim();

    const username = String(
      body.username ?? ""
    )
      .trim()
      .toLowerCase();

    const email = String(
      body.email ?? ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password ?? ""
    );

    if (
      !fullName ||
      !username ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, username, email and temporary password are required.",
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

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Temporary password must contain at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    // Check username
    const existingUsername =
      await db.orm.public.User
        .where({
          username,
        })
        .first();

    if (existingUsername) {
      return NextResponse.json(
        {
          error:
            "Username already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Check email
    const existingEmail =
      await db.orm.public.User
        .where({
          email,
        })
        .first();

    if (existingEmail) {
      return NextResponse.json(
        {
          error:
            "Email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Hash temporary password
    const passwordHash =
      await hashPassword(
        password
      );

    // Create NORMAL ADMIN only
    const user =
      await db.orm.public.User.create({
        fullName,
        username,
        email,
        passwordHash,
        phone: null,
        role: "ADMIN",
        status: "ACTIVE",
        profileImageUrl: null,
        lastLoginAt: null,
      });

    return NextResponse.json(
      {
        message:
          "Admin account created successfully.",

        user: {
          id: user.id,
          fullName:
            user.fullName,
          username:
            user.username,
          email:
            user.email,
          role:
            user.role,
          status:
            user.status,
          createdAt:
            user.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE ADMIN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create admin account.",
      },
      {
        status: 500,
      }
    );
  }
}