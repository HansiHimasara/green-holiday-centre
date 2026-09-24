import { NextResponse } from "next/server";

import {
  calculateBookingPrice,
  type BookingPricingServiceType,
} from "@/src/server/bookingPricing";

export const runtime = "nodejs";

const validServiceTypes = new Set([
  "AIRPORT_TRANSFER",
  "DAY_TOUR",
  "ROUND_TOUR",
]);

type BookingQuoteRequestBody = {
  serviceType?: unknown;
  pricingId?: unknown;
  pickupLocation?: unknown;
  dropoffLocation?: unknown;
  waypoints?: unknown;
};

function readOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}

function readWaypoints(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as BookingQuoteRequestBody;

    const serviceType =
      readOptionalString(body.serviceType);

    if (
      !serviceType ||
      !validServiceTypes.has(serviceType)
    ) {
      return NextResponse.json(
        {
          error:
            "A valid service type is required.",
        },
        {
          status: 400,
        }
      );
    }

    const pricingId =
      Number(body.pricingId);

    if (
      !Number.isInteger(pricingId) ||
      pricingId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid pricing route is required.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await calculateBookingPrice({
        serviceType:
          serviceType as BookingPricingServiceType,
        pricingId,
        pickupLocation:
          readOptionalString(
            body.pickupLocation
          ),
        dropoffLocation:
          readOptionalString(
            body.dropoffLocation
          ),
        waypoints:
          readWaypoints(body.waypoints),
      });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "BOOKING QUOTE ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to calculate booking price.";

    const status =
      message.includes(
        "OPENROUTESERVICE_API_KEY"
      )
        ? 500
        : 400;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      }
    );
  }
}