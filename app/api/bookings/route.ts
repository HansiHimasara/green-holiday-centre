import { withApi } from "@/src/server/http/guard";
import { sendBookingEmail } from "@/src/server/email/booking";
import { receiptToken } from "@/src/server/bookingLinks";
import { validBookingDate, earliestBookingDate } from "@/src/server/bookingDates";
import { createHash, randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

import {
  calculateBookingPrice,
  BookingPricingError,
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

function createBookingReference() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  const randomPart =
    randomBytes(3)
      .toString("hex")
      .toUpperCase();

  return `GH-${year}${month}${day}-${randomPart}`;
}

function readText(
  value: unknown
) {
  return String(
    value ?? ""
  ).trim();
}

function optionalText(
  value: unknown
) {
  const text =
    readText(value);

  return text || null;
}

function readDestinations(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((destination) =>
      readText(destination)
    )
    .filter(Boolean);
}

async function findRetry(bookingReference: string) {
  const booking = await db.orm.public.Booking.where({ bookingReference }).first();
  if (!booking) return null;
  return NextResponse.json({ message: "This reservation has already been created.", emailSent: false,
    confirmationToken: receiptToken(booking.id, booking.bookingReference),
    booking: { id: booking.id, bookingReference: booking.bookingReference, serviceType: booking.serviceType,
      status: booking.status, paymentStatus: booking.paymentStatus, totalAmount: Number(booking.totalAmount), currency: booking.currency },
  });
}

async function handlePOST(
  request: Request
) {
  let retryReference = "";
  try {
    const body =
      await request.json();

    // Fail before saving if secure confirmation links cannot be issued.
    receiptToken(0, "configuration-check");
    const requestId = body.requestId;
    if (requestId !== undefined && (typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId))) {
      return NextResponse.json({ error: "Invalid booking request identifier." }, { status: 400 });
    }
    retryReference = requestId ? `GH-${createHash("sha256").update(requestId).digest("hex").slice(0, 24).toUpperCase()}` : "";
    const customer =
      body.customer ?? {};

    const fullName =
      readText(
        customer.fullName
      );

    const email =
      readText(
        customer.email
      ).toLowerCase();

    const phone =
      readText(
        customer.phone
      );

    const passportNumber =
      readText(
        customer.passportNumber
      );

    const serviceType =
      readText(
        body.serviceType
      ) as ServiceType;

    const vehicleTypeId =
      Number(
        body.vehicleTypeId
      );

    const travelDate =
      readText(
        body.travelDate
      );

    const passengerCount =
      Number(
        body.passengerCount
      );

    const luggageCount =
      Number(
        body.luggageCount ??
          0
      );

    const numberOfNights =
      body.numberOfNights ===
        undefined ||
      body.numberOfNights ===
        null ||
      body.numberOfNights ===
        ""
        ? null
        : Number(
            body.numberOfNights
          );

    const pickupLocation =
      readText(
        body.pickupLocation
      );

    const dropoffLocation =
      readText(
        body.dropoffLocation
      );

    const destinations =
      readDestinations(
        body.destinations
      );

    /* ==========================================
       CUSTOMER VALIDATION
    ========================================== */

    if (
      !fullName ||
      !email ||
      !phone ||
      !passportNumber
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, email, WhatsApp contact number, and passport number are required.",
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

    /* ==========================================
       SERVICE VALIDATION
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

    /* ==========================================
       VEHICLE VALIDATION
    ========================================== */

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

    if (!validBookingDate(travelDate)) {
      return NextResponse.json(
        {
          error:
            `Select a date on or after ${earliestBookingDate()} (Sri Lanka time).`,
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        passengerCount
      ) ||
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

    if (
      !Number.isInteger(
        luggageCount
      ) ||
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

    if (
      numberOfNights !==
        null &&
      (
        !Number.isInteger(
          numberOfNights
        ) ||
        numberOfNights <
          0
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

    if (body.returnDate && (String(body.returnDate) < travelDate || !validBookingDate(String(body.returnDate)))) {
      return NextResponse.json({ error: "Return date must be on or after travel date." }, { status: 400 });
    }

    if (!/^\+[1-9]\d{7,14}$/.test(phone.replace(/[\s().-]/g, "")) || !/^[A-Z0-9]{5,20}$/i.test(passportNumber)) {
      return NextResponse.json({ error: "Enter a valid international phone number and passport number." }, { status: 400 });
    }

    /* ==========================================
       LOCATION VALIDATION
    ========================================== */

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
      destinations.length <
        1
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
      destinations.length <
        1
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

    if (serviceType === "ROUND_TOUR") {
      const expectedReturn = new Date(`${travelDate}T00:00:00Z`);
      expectedReturn.setUTCDate(expectedReturn.getUTCDate() + destinations.length);
      if (numberOfNights !== destinations.length || body.returnDate !== expectedReturn.toISOString().slice(0, 10)) {
        return NextResponse.json({ error: "Round Tour nights and return date must match the overnight destinations." }, { status: 400 });
      }
    }

    /* ==========================================
       GET REAL VEHICLE
    ========================================== */

    if (retryReference) {
      const retry = await findRetry(retryReference);
      if (retry) return retry;
    }
    const vehicle =
      await db.orm.public.VehicleType
        .where({
          id: vehicleTypeId,
        })
        .first();

    if (
      !vehicle ||
      vehicle.status !==
        "ACTIVE"
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

    /* ==========================================
       CAPACITY VALIDATION
    ========================================== */

    if (
      passengerCount >
      vehicle.passengerCapacity
    ) {
      return NextResponse.json(
        {
          error: `${vehicle.name} allows a maximum of ${vehicle.passengerCapacity} passengers.`,
        },
        {
          status: 400,
        }
      );
    }

    if (
      luggageCount >
      vehicle.luggageCapacity
    ) {
      return NextResponse.json(
        {
          error: `${vehicle.name} allows a maximum of ${vehicle.luggageCapacity} luggage items.`,
        },
        {
          status: 400,
        }
      );
    }

    /* ==========================================
       VEHICLE RATE FROM DATABASE
    ========================================== */

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
            "A valid rate per kilometre has not been configured for the selected vehicle.",
        },
        {
          status: 400,
        }
      );
    }

    /* ==========================================
       SERVER-SIDE PRICE CALCULATION

       Never trust browser totalAmount.
    ========================================== */

    const calculatedPrice =
      await calculateBookingPrice({
        serviceType,

        pickupLocation,

        dropoffLocation,

        waypoints:
          serviceType ===
          "AIRPORT_TRANSFER"
            ? []
            : destinations,

        vehicleRatePerKm,
      });

    const totalAmount =
      calculatedPrice.totalAmount;

    const currency =
      calculatedPrice.currency;

    const bookingReference = retryReference || createBookingReference();

    /* ==========================================
       SAVE CUSTOMER + BOOKING
    ========================================== */

    const result =
      await db.transaction(
        async (tx) => {
          const existingCustomer =
            await tx.orm.public.Customer
              .where({
                email,
              })
              .first();

          let customerId:
            number;

          if (
            existingCustomer
          ) {
            // A guest request must never overwrite an existing customer's personal data.
            // Existing records can only be edited through the authenticated admin API.
            customerId = existingCustomer.id;
          } else {
            const newCustomer =
              await tx.orm.public.Customer.create(
                {
                  fullName,

                  email,

                  phone,

                  passportNumber,

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
                }
              );

            if (!newCustomer) {
              throw new Error(
                "Unable to create customer."
              );
            }

            customerId =
              newCustomer.id;
          }

          /* =====================================
             CREATE BOOKING
          ===================================== */

          const booking =
            await tx.orm.public.Booking.create(
              {
                bookingReference,

                customerId,

                vehicleTypeId,

                serviceType,

                travelDate,

                returnDate:
                  optionalText(
                    body.returnDate
                  ),

                passengerCount,

                luggageCount,

                numberOfNights,

                pickupLocation,

                dropoffLocation,

                flightNumber:
                  optionalText(
                    body.flightNumber
                  ),

                specialRequests:
                  optionalText(
                    body.specialRequests
                  ),

                totalAmount:
                  totalAmount.toFixed(
                    2
                  ),

                currency,

                status:
                  "PENDING",

                paymentStatus:
                  "UNPAID",
              }
            );

          if (!booking) {
            throw new Error(
              "Unable to create booking."
            );
          }

          /*
           * Store destinations.
           *
           * Day Tour:
           * row 1 = main destination
           *
           * Round Tour:
           * row 1, 2, 3... =
           * destination sequence
           */
          if (
            serviceType ===
              "DAY_TOUR" ||
            serviceType ===
              "ROUND_TOUR"
          ) {
            for (
              let index = 0;
              index <
              destinations.length;
              index += 1
            ) {
              await tx.orm.public.BookingDestination.create(
                {
                  bookingId:
                    booking.id,

                  nightNumber:
                    index + 1,

                  destination:
                    destinations[
                      index
                    ],
                }
              );
            }
          }

          return {
            booking,
            customerId,
          };
        }
      );

    let emailSent = false;
    {
      try {
        const baseUrl = process.env.APP_BASE_URL;
        if (!baseUrl || !/^https?:\/\//.test(baseUrl)) throw new Error("APP_BASE_URL is not configured.");
        const token = receiptToken(result.booking.id, bookingReference);
        const paymentLink = `${baseUrl}/customer/booking/confirmation?booking=${result.booking.id}&token=${encodeURIComponent(token)}`;
        await sendBookingEmail({
          to: email, name: fullName, reference: bookingReference, service: serviceType,
          travelDate, vehicle: vehicle.name, pickup: pickupLocation, dropoff: dropoffLocation,
          amount: totalAmount, currency, paymentLink,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("RESERVATION EMAIL ERROR:", emailError);
      }
    }

    /* ==========================================
       RESPONSE
    ========================================== */

    return NextResponse.json(
      {
        message: emailSent ? "Reservation created and email sent." : "Booking created; email delivery could not be confirmed.",

        emailSent,
        confirmationToken: receiptToken(result.booking.id, bookingReference),

        booking: {
          id:
            result.booking.id,

          bookingReference:
            result.booking
              .bookingReference,

          serviceType:
            result.booking
              .serviceType,

          status:
            result.booking
              .status,

          paymentStatus:
            result.booking
              .paymentStatus,

          customerId:
            result.customerId,

          vehicleTypeId:
            result.booking
              .vehicleTypeId,

          totalAmount,

          currency,

          actualKilometres:
            calculatedPrice.route
              .actualKilometres,

          billableKilometres:
            calculatedPrice.route
              .billableKilometres,

          routeDurationMinutes:
            calculatedPrice.route
              .durationMinutes,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    // A concurrent retry may have committed the same unique booking reference.
    if (retryReference) {
      try { const retry = await findRetry(retryReference); if (retry) return retry; } catch { /* preserve the original failure below */ }
    }
    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    const message = error instanceof BookingPricingError ? error.message : "Unable to create the booking. Please check the details or contact the travel office.";

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
export const POST = withApi(handlePOST, "/api/bookings");
