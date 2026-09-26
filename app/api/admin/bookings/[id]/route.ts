import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/server/auth/session";

export const runtime = "nodejs";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

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
      await getCurrentUser();

    if (
      !user ||
      (
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN"
      )
    ) {
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

    const bookingId =
      Number(params.id);

    if (
      !Number.isInteger(
        bookingId
      ) ||
      bookingId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid booking ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const status =
      String(
        body.status ?? ""
      ).toUpperCase() as BookingStatus;

    const allowedStatuses:
      BookingStatus[] = [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
      ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid booking status.",
        },
        {
          status: 400,
        }
      );
    }

    const existingBooking =
      await db.orm.public.Booking
        .where({
          id: bookingId,
        })
        .first();

    if (!existingBooking) {
      return NextResponse.json(
        {
          error:
            "Booking not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedBooking =
      await db.orm.public.Booking
        .where({
          id: bookingId,
        })
        .update({
          status,
        });

    if (!updatedBooking) {
      return NextResponse.json(
        {
          error:
            "Unable to update booking.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Booking updated successfully.",

      booking: {
        dbId:
          updatedBooking.id,

        id:
          updatedBooking
            .bookingReference,

        status:
          updatedBooking.status
            .toLowerCase(),
      },
    });
  } catch (error) {
    console.error(
      "ADMIN BOOKING UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update booking.",
      },
      {
        status: 500,
      }
    );
  }
}