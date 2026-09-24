import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import {
  calculateBookingPrice,
  type BookingPricingServiceType,
} from "@/src/server/bookingPricing";

export const runtime = "nodejs";

type ServiceType =
  | "AIRPORT_TRANSFER"
  | "DAY_TOUR"
  | "ROUND_TOUR";

const allowedServices: ServiceType[] = [
  "AIRPORT_TRANSFER",
  "DAY_TOUR",
  "ROUND_TOUR",
];

function createBookingReference() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const randomPart = randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `GH-${year}${month}${day}-${randomPart}`;
}

function optionalText(value: unknown) {
  const text = String(value ?? "").trim();

  return text || null;
}

function optionalString(value: unknown) {
  const text = String(value ?? "").trim();

  return text || undefined;
}

function readDestinations(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((destination: unknown) =>
          String(destination ?? "").trim()
        )
        .filter(Boolean)
    : [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customer = body.customer ?? {};

    const fullName = String(
      customer.fullName ?? ""
    ).trim();

    const email = String(
      customer.email ?? ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
      customer.phone ?? ""
    ).trim();

    const vehicleTypeId = Number(
      body.vehicleTypeId
    );

    const serviceType = String(
      body.serviceType ?? ""
    ) as ServiceType;

    const pricingId = Number(
      body.pricingId
    );

    const travelDate = String(
      body.travelDate ?? ""
    ).trim();

    const passengerCount = Number(
      body.passengerCount
    );

    const luggageCount = Number(
      body.luggageCount ?? 0
    );

    const numberOfNights =
      body.numberOfNights === undefined ||
      body.numberOfNights === null ||
      body.numberOfNights === ""
        ? null
        : Number(body.numberOfNights);

    const pickupLocation = optionalString(
      body.pickupLocation
    );

    const dropoffLocation = optionalString(
      body.dropoffLocation
    );

    const destinations = readDestinations(
      body.destinations
    );

    // Validate customer
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            "Full name, email and phone number are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
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

    // Validate service
    if (!allowedServices.includes(serviceType)) {
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

    // Airport Transfer and Day Tour use a pricing route.
    // Round Tour is handled as a reservation request,
    // so no pricing route is required.
    if (
      serviceType !== "ROUND_TOUR" &&
      (
        !Number.isInteger(pricingId) ||
        pricingId <= 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid pricing route.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate vehicle
    if (
      !Number.isInteger(vehicleTypeId) ||
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

    // Validate travel date
    if (!travelDate) {
      return NextResponse.json(
        {
          error:
            "Travel date is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate passengers
    if (
      !Number.isInteger(passengerCount) ||
      passengerCount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Passenger count must be at least 1.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate luggage
    if (
      !Number.isInteger(luggageCount) ||
      luggageCount < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Luggage count is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate nights
    if (
      numberOfNights !== null &&
      (
        !Number.isInteger(numberOfNights) ||
        numberOfNights < 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Number of nights is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    // Round tour must have destinations
    if (
      serviceType === "ROUND_TOUR" &&
      destinations.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please add at least one destination for the round tour.",
        },
        {
          status: 400,
        }
      );
    }

    // Check selected vehicle
    const vehicle =
      await db.orm.public.VehicleType
        .where({
          id: vehicleTypeId,
        })
        .first();

    if (
      !vehicle ||
      vehicle.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        {
          error:
            "The selected vehicle is not available.",
        },
        {
          status: 404,
        }
      );
    }

    // Check passenger capacity
    if (
      passengerCount >
      vehicle.passengerCapacity
    ) {
      return NextResponse.json(
        {
          error: `This vehicle allows maximum ${vehicle.passengerCapacity} passengers.`,
        },
        {
          status: 400,
        }
      );
    }

    // Check luggage capacity
    if (
      luggageCount >
      vehicle.luggageCapacity
    ) {
      return NextResponse.json(
        {
          error: `This vehicle allows maximum ${vehicle.luggageCapacity} luggage items.`,
        },
        {
          status: 400,
        }
      );
    }

    // Airport Transfer and Day Tour use automatic
    // server-side pricing.
    // Round Tour is currently saved as a reservation
    // request with price pending.
    const calculatedPrice =
      serviceType === "ROUND_TOUR"
        ? null
        : await calculateBookingPrice({
            serviceType:
              serviceType as BookingPricingServiceType,
            pricingId,
            pickupLocation,
            dropoffLocation,
            waypoints:
              serviceType === "DAY_TOUR"
                ? destinations
                : [],
          });

    const totalAmount =
      calculatedPrice?.totalAmount ?? 0;

    const currency =
      calculatedPrice?.currency ?? "LKR";

    const bookingReference =
      createBookingReference();

    // Find existing customer
    const existingCustomer =
      await db.orm.public.Customer
        .where({
          email,
        })
        .first();

    let customerId: number;

    // Existing customer
    if (existingCustomer) {
      const updatedCustomer =
        await db.orm.public.Customer
          .where({
            id: existingCustomer.id,
          })
          .update({
            fullName,
            phone,

            passportNumber:
              optionalText(
                customer.passportNumber
              ),

            nationality:
              optionalText(
                customer.nationality
              ),

            address:
              optionalText(
                customer.address
              ),

            specialRequirements:
              optionalText(
                customer.specialRequirements
              ),
          });

      if (!updatedCustomer) {
        throw new Error(
          "Unable to update customer."
        );
      }

      customerId =
        updatedCustomer.id;
    } else {
      // New customer
      const newCustomer =
        await db.orm.public.Customer.create({
          fullName,
          email,
          phone,

          passportNumber:
            optionalText(
              customer.passportNumber
            ),

          nationality:
            optionalText(
              customer.nationality
            ),

          address:
            optionalText(
              customer.address
            ),

          specialRequirements:
            optionalText(
              customer.specialRequirements
            ),
        });

      if (!newCustomer) {
        throw new Error(
          "Unable to create customer."
        );
      }

      customerId =
        newCustomer.id;
    }

    // Create booking
    const booking =
      await db.orm.public.Booking.create({
        bookingReference,

        customerId,

        vehicleTypeId,

        serviceType,

        travelDate,

        returnDate: optionalText(
          body.returnDate
        ),

        passengerCount,

        luggageCount,

        numberOfNights,

        pickupLocation:
          optionalText(
            body.pickupLocation
          ),

        dropoffLocation:
          optionalText(
            body.dropoffLocation
          ),

        flightNumber:
          optionalText(
            body.flightNumber
          ),

        specialRequests:
          optionalText(
            body.specialRequests
          ),

        totalAmount:
          totalAmount.toFixed(2),

        currency,

        status: "PENDING",

        paymentStatus: "UNPAID",
      });

    if (!booking) {
      throw new Error(
        "Unable to create booking."
      );
    }

    // Save Round Tour destinations
    if (serviceType === "ROUND_TOUR") {
      for (
        let index = 0;
        index < destinations.length;
        index += 1
      ) {
        await db.orm.public.BookingDestination.create(
          {
            bookingId:
              booking.id,

            nightNumber:
              index + 1,

            destination:
              destinations[index],
          }
        );
      }
    }

    // Successful booking response
    return NextResponse.json(
      {
        message:
          "Booking created successfully.",

        booking: {
          id: booking.id,

          bookingReference:
            booking.bookingReference,

          serviceType:
            booking.serviceType,

          status:
            booking.status,

          paymentStatus:
            booking.paymentStatus,

          customerId,

          vehicleTypeId:
            booking.vehicleTypeId,

          totalAmount,

          currency,

          actualKilometres:
            calculatedPrice?.route
              .actualKilometres ??
            null,

          routeDurationMinutes:
            calculatedPrice?.route
              .durationMinutes ??
            null,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create the booking.";

    const status =
      message.includes(
        "OPENROUTESERVICE_API_KEY"
      )
        ? 500
        : message.includes(
            "Unable to create"
          ) ||
          message.includes(
            "Unable to update"
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