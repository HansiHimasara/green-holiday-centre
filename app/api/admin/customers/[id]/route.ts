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

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
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

    const params =
      await context.params;

    const customerId =
      Number(params.id);

    if (
      !Number.isInteger(
        customerId
      ) ||
      customerId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid customer ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingCustomer =
      await db.orm.public.Customer
        .where({
          id: customerId,
        })
        .first();

    if (!existingCustomer) {
      return NextResponse.json(
        {
          error:
            "Customer not found.",
        },
        {
          status: 404,
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

    const allCustomers =
      await db.orm.public.Customer.all();

    const duplicateEmail =
      allCustomers.find(
        (customer) =>
          customer.email
            .toLowerCase() ===
            email &&
          customer.id !==
            customerId
      );

    if (duplicateEmail) {
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

    const updatedCustomer =
      await db.orm.public.Customer
        .where({
          id: customerId,
        })
        .update({
          fullName,
          email,
          phone,

          passportNumber:
            optionalText(
              body.passport
            ),

          nationality:
            optionalText(
              body.nationality
            ),
        });

    if (!updatedCustomer) {
      return NextResponse.json(
        {
          error:
            "Unable to update customer.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Customer updated successfully.",

      customer: {
        id:
          updatedCustomer.id,

        name:
          updatedCustomer.fullName,

        passport:
          updatedCustomer
            .passportNumber ??
          "",

        nationality:
          updatedCustomer
            .nationality ??
          "",

        email:
          updatedCustomer.email,

        contact:
          updatedCustomer.phone,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN CUSTOMER UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update customer.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
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

    const params =
      await context.params;

    const customerId =
      Number(params.id);

    if (
      !Number.isInteger(
        customerId
      ) ||
      customerId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid customer ID.",
        },
        {
          status: 400,
        }
      );
    }

    const customer =
      await db.orm.public.Customer
        .where({
          id: customerId,
        })
        .first();

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const bookings =
      await db.orm.public.Booking
        .where({
          customerId,
        })
        .all();

    if (
      bookings.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "This customer has booking records and cannot be deleted.",
        },
        {
          status: 409,
        }
      );
    }

    const deletedCount =
      await db.orm.public.Customer
        .where({
          id: customerId,
        })
        .deleteAndCount();

    if (
      deletedCount === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to delete customer.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Customer deleted successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN CUSTOMER DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete customer.",
      },
      {
        status: 500,
      }
    );
  }
}