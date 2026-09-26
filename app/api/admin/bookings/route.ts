import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/server/auth/session";

export const runtime = "nodejs";

export async function GET() {
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

    const bookings =
      await db.orm.public.Booking.all();

    const customers =
      await db.orm.public.Customer.all();

    const vehicles =
      await db.orm.public.VehicleType.all();

    const customerMap =
      new Map(
        customers.map(
          (customer) => [
            customer.id,
            customer,
          ]
        )
      );

    const vehicleMap =
      new Map(
        vehicles.map(
          (vehicle) => [
            vehicle.id,
            vehicle,
          ]
        )
      );

    const bookingList =
      bookings
        .map((booking) => {
          const customer =
            customerMap.get(
              booking.customerId
            );

          const vehicle =
            vehicleMap.get(
              booking.vehicleTypeId
            );

          return {
            dbId:
              booking.id,

            id:
              booking.bookingReference,

            customer:
              customer?.fullName ??
              "Unknown Customer",

            date:
              String(
                booking.travelDate
              ),

            vehicle:
              vehicle?.name ??
              "Unknown Vehicle",

            serviceType:
              booking.serviceType,

            status:
              booking.status
                .toLowerCase(),

            paymentStatus:
              booking.paymentStatus,

            totalAmount:
              String(
                booking.totalAmount
              ),

            currency:
              booking.currency,

            createdAt:
              booking.createdAt,
          };
        })
        .sort(
          (a, b) =>
            b.dbId - a.dbId
        );

    return NextResponse.json({
      bookings:
        bookingList,
    });
  } catch (error) {
    console.error(
      "ADMIN BOOKINGS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load bookings.",
      },
      {
        status: 500,
      }
    );
  }
}