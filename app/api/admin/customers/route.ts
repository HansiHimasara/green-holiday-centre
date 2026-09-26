import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/server/auth/session";

export const runtime = "nodejs";

async function requireAdminUser() {
  const user =
    await getCurrentUser();

  if (
    !user ||
    (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    )
  ) {
    return null;
  }

  return user;
}

function optionalText(
  value: unknown
) {
  const text =
    String(value ?? "").trim();

  return text || null;
}

export async function GET() {
  try {
    const user =
      await requireAdminUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const customers =
      await db.orm.public.Customer.all();

    const customerList =
      customers
        .map((customer) => ({
          id:
            customer.id,

          name:
            customer.fullName,

          passport:
            customer.passportNumber ??
            "",

          nationality:
            customer.nationality ??
            "",

          email:
            customer.email,

          contact:
            customer.phone,
        }))
        .sort(
          (a, b) =>
            b.id - a.id
        );

    return NextResponse.json({
      customers:
        customerList,
    });
  } catch (error) {
    console.error(
      "ADMIN CUSTOMERS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load customers.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await requireAdminUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const fullName =
      String(
        body.name ?? ""
      ).trim();

    const email =
      String(
        body.email ?? ""
      )
        .trim()
        .toLowerCase();

    const phone =
      String(
        body.contact ?? ""
      ).trim();

    const passportNumber =
      optionalText(
        body.passport
      );

    const nationality =
      optionalText(
        body.nationality
      );

    if (
      !fullName ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, email and contact number are required.",
        },
        {
          status: 400,
        }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const existingCustomer =
      await db.orm.public.Customer
        .where({
          email,
        })
        .first();

    if (existingCustomer) {
      return NextResponse.json(
        {
          error:
            "A customer with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const customer =
      await db.orm.public.Customer.create(
        {
          fullName,
          email,
          phone,
          passportNumber,
          nationality,
          address: null,
          specialRequirements:
            null,
        }
      );

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "Unable to create customer.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Customer created successfully.",

        customer: {
          id:
            customer.id,

          name:
            customer.fullName,

          passport:
            customer.passportNumber ??
            "",

          nationality:
            customer.nationality ??
            "",

          email:
            customer.email,

          contact:
            customer.phone,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN CUSTOMER CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create customer.",
      },
      {
        status: 500,
      }
    );
  }
}