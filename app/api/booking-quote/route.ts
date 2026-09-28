import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

import {
  calculateBookingPrice,
  type BookingPricingServiceType,
} from "@/src/server/bookingPricing";

export const runtime =
  "nodejs";

type ServiceType =
  BookingPricingServiceType;

const allowedServices:
  ServiceType[] = [
    "AIRPORT_TRANSFER",
    "DAY_TOUR",
    "ROUND_TOUR",
  ];

function readText(
  value: unknown
) {
  return String(
    value ?? ""
  ).trim();
}

function readWaypoints(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((location) =>
      readText(location)
    )
    .filter(Boolean);
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const serviceType =
      readText(
        body.serviceType
      ) as ServiceType;

    const vehicleTypeId =
      Number(
        body.vehicleTypeId
      );

    const pickupLocation =
      readText(
        body.pickupLocation
      );

    const dropoffLocation =
      readText(
        body.dropoffLocation
      );

    const waypoints =
      readWaypoints(
        body.waypoints
      );

    /* ==========================================
       VALIDATION
    ========================================== */

    if (
      !allowedServices.includes(
        serviceType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid booking service.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        vehicleTypeId
      ) ||
      vehicleTypeId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid vehicle.",
        },
        {
          status: 400,
        }
      );
    }

    if (!pickupLocation) {
      return NextResponse.json(
        {
          error:
            "Pickup location is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!dropoffLocation) {
      return NextResponse.json(
        {
          error:
            "Drop location is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      serviceType ===
        "DAY_TOUR" &&
      waypoints.length < 1
    ) {
      return NextResponse.json(
        {
          error:
            "The Day Tour destination is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      serviceType ===
        "ROUND_TOUR" &&
      waypoints.length < 1
    ) {
      return NextResponse.json(
        {
          error:
            "At least one Round Tour destination is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* ==========================================
       GET VEHICLE FROM DATABASE
    ========================================== */

    const vehicle =
      await db.orm.public.VehicleType
        .where({
          id: vehicleTypeId,
        })
        .first();

    if (!vehicle) {
      return NextResponse.json(
        {
          error:
            "The selected vehicle was not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      vehicle.status !==
      "ACTIVE"
    ) {
      return NextResponse.json(
        {
          error:
            "The selected vehicle is not currently available.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * IMPORTANT:
     *
     * Customer does NOT send
     * the vehicle rate.
     *
     * We read it from DB.
     */
    const vehicleRatePerKm =
      Number(
        vehicle.ratePerKm
      );

    if (
      !Number.isFinite(
        vehicleRatePerKm
      ) ||
      vehicleRatePerKm <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "A rate per kilometre has not been configured for this vehicle.",
        },
        {
          status: 400,
        }
      );
    }

    /* ==========================================
       CALCULATE PRICE
    ========================================== */

    const result =
      await calculateBookingPrice({
        serviceType,

        pickupLocation,

        dropoffLocation,

        waypoints:
          serviceType ===
          "AIRPORT_TRANSFER"
            ? []
            : waypoints,

        vehicleRatePerKm,
      });

    return NextResponse.json({
      totalAmount:
        result.totalAmount,

      currency:
        result.currency,

      route: {
        actualKilometres:
          result.route
            .actualKilometres,

        billableKilometres:
          result.route
            .billableKilometres,

        durationMinutes:
          result.route
            .durationMinutes,
      },
    });
  } catch (error) {
    console.error(
      "BOOKING QUOTE ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to calculate transportation cost.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      }
    );
  }
}