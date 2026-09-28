"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Button from "@/components/ui/Button";

import {
  getBookingDraft,
  saveBookingDraft,
  type BookingDraft,
} from "@/src/client/bookingDraft";

type BookingQuoteResponse = {
  totalAmount?: number | string;

  currency?: string;

  route?: {
    actualKilometres?: number;
    billableKilometres?: number;
    durationMinutes?: number;
  };

  error?: string;
};

function formatTravelDate(
  value?: string
) {
  if (!value) {
    return "Not provided";
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function shortLocation(
  value?: string
) {
  if (!value) {
    return "";
  }

  return (
    value
      .split(",")[0]
      ?.trim() ||
    value.trim()
  );
}

function serviceName(
  booking: BookingDraft
) {
  if (
    booking.serviceType ===
    "AIRPORT_TRANSFER"
  ) {
    return "Airport Transfer";
  }

  if (
    booking.serviceType ===
    "DAY_TOUR"
  ) {
    return "Day Tour";
  }

  if (
    booking.serviceType ===
    "ROUND_TOUR"
  ) {
    if (
      booking.numberOfNights &&
      booking.numberOfNights >
        0
    ) {
      return `Round Tour — ${booking.numberOfNights} ${
        booking.numberOfNights ===
        1
          ? "Night"
          : "Nights"
      }`;
    }

    return "Round Tour";
  }

  return "Not provided";
}

function createPlannedRoute(
  booking: BookingDraft
) {
  const pickup =
    shortLocation(
      booking.pickupLocation
    );

  const drop =
    shortLocation(
      booking.dropoffLocation
    );

  const destinations =
    (
      booking.destinations ??
      []
    )
      .map(
        (location) =>
          shortLocation(
            location
          )
      )
      .filter(Boolean);

  if (
    booking.serviceType ===
    "AIRPORT_TRANSFER"
  ) {
    return [
      pickup,
      drop,
    ].filter(Boolean);
  }

  if (
    booking.serviceType ===
    "DAY_TOUR"
  ) {
    return [
      pickup,
      ...destinations,
      drop,
    ].filter(Boolean);
  }

  if (
    booking.serviceType ===
    "ROUND_TOUR"
  ) {
    return [
      pickup,
      ...destinations,
      drop,
    ].filter(Boolean);
  }

  return [];
}

function money(
  amount?: number,
  currency?: string
) {
  if (
    typeof amount !==
      "number" ||
    !Number.isFinite(
      amount
    ) ||
    !currency
  ) {
    return "Calculating...";
  }

  return `${currency} ${amount.toLocaleString(
    "en-LK",
    {
      maximumFractionDigits:
        0,
    }
  )}`;
}

export default function BookingSummaryPage() {
  const router =
    useRouter();

  /*
   * IMPORTANT:
   *
   * Not nullable.
   * This removes all of the
   * "draft is possibly null"
   * TypeScript errors.
   */
  const [
    booking,
    setBooking,
  ] =
    useState<BookingDraft>(
      {}
    );

  const [
    loaded,
    setLoaded,
  ] = useState(false);

  const [
    confirmed,
    setConfirmed,
  ] = useState(false);

  const [
    quoteLoading,
    setQuoteLoading,
  ] = useState(false);

  const [
    quoteError,
    setQuoteError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* ==========================================
     LOAD SAVED BOOKING
  ========================================== */

  useEffect(() => {
    setBooking(
      getBookingDraft()
    );

    setLoaded(true);
  }, []);

  /* ==========================================
     GET BACKEND PRICE
  ========================================== */

  useEffect(() => {
    if (!loaded) {
      return;
    }

    if (
      !booking.serviceType ||
      !booking.vehicleTypeId ||
      !booking.pickupLocation ||
      !booking.dropoffLocation
    ) {
      setQuoteLoading(
        false
      );

      setQuoteError(
        "Travel details are incomplete."
      );

      return;
    }

    const serviceType =
      booking.serviceType;

    const vehicleTypeId =
      booking.vehicleTypeId;

    const pickupLocation =
      booking.pickupLocation;

    const dropoffLocation =
      booking.dropoffLocation;

    const destinations =
      (
        booking.destinations ??
        []
      )
        .map(
          (location) =>
            location.trim()
        )
        .filter(Boolean);

    let cancelled =
      false;

    async function loadPrice() {
      try {
        setQuoteLoading(
          true
        );

        setQuoteError("");

        const response =
          await fetch(
            "/api/booking-quote",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    serviceType,

                    vehicleTypeId,

                    pickupLocation,

                    dropoffLocation,

                    waypoints:
                      serviceType ===
                      "AIRPORT_TRANSFER"
                        ? []
                        : destinations,
                  }
                ),
            }
          );

        const data =
          (await response.json()) as BookingQuoteResponse;

        if (
          !response.ok
        ) {
          throw new Error(
            data.error ||
              "Unable to calculate transportation cost."
          );
        }

        const amount =
          Number(
            data.totalAmount
          );

        if (
          !Number.isFinite(
            amount
          ) ||
          !data.currency
        ) {
          throw new Error(
            "The server did not return a valid transportation cost."
          );
        }

        if (cancelled) {
          return;
        }

        const updates:
          Partial<BookingDraft> =
          {
            totalAmount:
              amount,

            currency:
              data.currency,

            actualKilometres:
              data.route
                ?.actualKilometres,

            routeDurationMinutes:
              data.route
                ?.durationMinutes,
          };

        saveBookingDraft(
          updates
        );

        setBooking(
          (previous) => ({
            ...previous,
            ...updates,
          })
        );
      } catch (error) {
        console.error(
          "Quote error:",
          error
        );

        if (!cancelled) {
          setQuoteError(
            error instanceof
              Error
              ? error.message
              : "Unable to calculate transportation cost."
          );
        }
      } finally {
        if (!cancelled) {
          setQuoteLoading(
            false
          );
        }
      }
    }

    void loadPrice();

    return () => {
      cancelled = true;
    };
  }, [
    loaded,
    booking.serviceType,
    booking.vehicleTypeId,
    booking.pickupLocation,
    booking.dropoffLocation,
    booking.destinations,
  ]);

  /* ==========================================
     LOADING
  ========================================== */

  if (!loaded) {
    return (
      <BookingPageShell>
        <section className="flex min-h-[500px] items-center justify-center bg-[#F8F7F1]">
          <p className="text-sm text-[var(--text-secondary)]">
            Loading booking
            summary...
          </p>
        </section>
      </BookingPageShell>
    );
  }

  /* ==========================================
     SERVICE TAB
  ========================================== */

  const serviceTab:
    | "airport-transfer"
    | "day-tour"
    | "round-tour" =
    booking.serviceType ===
    "DAY_TOUR"
      ? "day-tour"
      : booking.serviceType ===
          "ROUND_TOUR"
        ? "round-tour"
        : "airport-transfer";

  const plannedRoute =
    createPlannedRoute(
      booking
    );

  const summaryItems = [
    {
      label: "Tour Type",

      value:
        serviceName(
          booking
        ),
    },

    {
      label:
        "Selected Vehicle",

      value:
        booking.vehicleName ||
        "Not provided",
    },

    {
      label:
        "Travel Date",

      value:
        formatTravelDate(
          booking.travelDate
        ),
    },

    {
      label:
        "Total Passengers",

      value:
        typeof booking.passengerCount ===
        "number"
          ? `${booking.passengerCount} ${
              booking.passengerCount ===
              1
                ? "Passenger"
                : "Passengers"
            }`
          : "Not provided",
    },

    {
      label:
        "Luggage Requirement",

      value:
        typeof booking.luggageCount ===
        "number"
          ? `${booking.luggageCount} ${
              booking.luggageCount ===
              1
                ? "Bag"
                : "Bags"
            }`
          : "Not provided",
    },
  ];

  /* ==========================================
     CONTINUE TO PAYMENT
  ========================================== */

  async function handleContinueToPayment() {
    if (!confirmed) {
      window.alert(
        "Please confirm that the details above are correct."
      );

      return;
    }

    if (
      !booking.serviceType ||
      !booking.vehicleTypeId ||
      !booking.travelDate ||
      !booking.pickupLocation ||
      !booking.dropoffLocation ||
      !booking.passengerCount
    ) {
      window.alert(
        "Your travel details are incomplete."
      );

      return;
    }

    if (
      booking.luggageCount ===
      undefined
    ) {
      window.alert(
        "Luggage requirement is missing."
      );

      return;
    }

    if (
      booking.serviceType ===
        "DAY_TOUR" &&
      !booking.destinations?.[0]?.trim()
    ) {
      window.alert(
        "The Day Tour destination is missing."
      );

      return;
    }

    if (
      booking.serviceType ===
      "ROUND_TOUR"
    ) {
      if (
        !booking.destinations ||
        booking.destinations
          .length === 0 ||
        booking.destinations.some(
          (location) =>
            !location.trim()
        )
      ) {
        window.alert(
          "One or more Round Tour destinations are missing."
        );

        return;
      }
    }

    const customer =
      booking.customer;

    if (!customer) {
      window.alert(
        "Please complete your personal details."
      );

      return;
    }

    if (
      !customer.fullName.trim() ||
      !customer.email.trim() ||
      !customer.phone.trim() ||
      !customer.passportNumber.trim()
    ) {
      window.alert(
        "Full name, email, WhatsApp contact number and passport number are required."
      );

      return;
    }

    if (quoteLoading) {
      window.alert(
        "Please wait until the transportation cost is calculated."
      );

      return;
    }

    if (
      quoteError ||
      typeof booking.totalAmount !==
        "number" ||
      !booking.currency
    ) {
      window.alert(
        quoteError ||
          "Transportation cost is unavailable."
      );

      return;
    }

    /*
     * Avoid duplicate booking
     * creation.
     */
    if (
      booking.bookingId &&
      booking.bookingReference
    ) {
      router.push(
        "/customer/booking/payment"
      );

      return;
    }

    try {
      setSubmitting(
        true
      );

      const response =
        await fetch(
          "/api/bookings",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            /*
             * Do NOT send price.
             *
             * /api/bookings
             * calculates it again.
             */
            body:
              JSON.stringify(
                {
                  serviceType:
                    booking.serviceType,

                  vehicleTypeId:
                    booking.vehicleTypeId,

                  travelDate:
                    booking.travelDate,

                  returnDate:
                    booking.returnDate,

                  passengerCount:
                    booking.passengerCount,

                  luggageCount:
                    booking.luggageCount,

                  numberOfNights:
                    booking.numberOfNights,

                  pickupLocation:
                    booking.pickupLocation,

                  dropoffLocation:
                    booking.dropoffLocation,

                  flightNumber:
                    booking.flightNumber,

                  specialRequests:
                    booking.specialRequests,

                  destinations:
                    booking.destinations ??
                    [],

                  customer: {
                    fullName:
                      customer.fullName,

                    email:
                      customer.email,

                    phone:
                      customer.phone,

                    passportNumber:
                      customer.passportNumber,

                    nationality:
                      customer.nationality,

                    address:
                      customer.address,

                    specialRequirements:
                      customer.specialRequirements,
                  },
                }
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        window.alert(
          data.error ||
            "Unable to create the booking."
        );

        return;
      }

      if (!data.booking) {
        window.alert(
          "Booking could not be created."
        );

        return;
      }

      const amount =
        Number(
          data.booking
            .totalAmount
        );

      const updates:
        Partial<BookingDraft> =
        {
          bookingId:
            data.booking.id,

          bookingReference:
            data.booking
              .bookingReference,

          totalAmount:
            Number.isFinite(
              amount
            )
              ? amount
              : booking.totalAmount,

          currency:
            data.booking
              .currency ||
            booking.currency,

          actualKilometres:
            typeof data.booking
              .actualKilometres ===
              "number"
              ? data.booking
                  .actualKilometres
              : booking.actualKilometres,

          routeDurationMinutes:
            typeof data.booking
              .routeDurationMinutes ===
              "number"
              ? data.booking
                  .routeDurationMinutes
              : booking.routeDurationMinutes,
        };

      saveBookingDraft(
        updates
      );

      setBooking(
        (previous) => ({
          ...previous,
          ...updates,
        })
      );

      router.push(
        "/customer/booking/payment"
      );
    } catch (error) {
      console.error(
        "Create booking error:",
        error
      );

      window.alert(
        "Something went wrong while creating your booking."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <BookingPageShell>
      {/* TOP */}

      <section className="relative overflow-hidden bg-white">
        <div className="relative z-10">

          <div className="mx-auto w-full max-w-[1280px] px-6 pt-7 md:px-10">
            <ServiceTabs
              active={
                serviceTab
              }
            />
          </div>

          <div className="mt-10 border-b border-[var(--border-light)]">
            <div className="mx-auto w-full max-w-[1280px] px-6 pb-6 md:px-10">

              <BookingStepHeader
                title="Booking Summary"
                step={3}
                totalSteps={4}
              />

            </div>
          </div>

        </div>
      </section>

      {/* SUMMARY */}

      <section className="bg-[#F8F7F1] py-10">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">

          <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_15px_45px_rgba(7,91,69,0.08)]">

            {/* HEADER */}

            <div className="relative overflow-hidden bg-[var(--green-deep)] px-6 py-6 md:px-8">

              <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-[var(--yellow-golden)]/20" />

              <div className="absolute -bottom-16 right-20 h-36 w-36 rounded-full bg-[var(--sky-blue)]/15" />

              <div className="relative z-10">

                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                  Your Journey
                </p>

                <h2 className="mt-2 font-serif text-[24px] font-semibold !text-white">
                  Review Your Travel
                  Details
                </h2>

                <p className="mt-1 text-[13px] text-white/70">
                  Please review your
                  booking before
                  continuing to
                  payment.
                </p>

              </div>

              <div className="relative z-10 mt-5 flex gap-2">

                <span className="h-1.5 w-10 rounded-full bg-[var(--green-light)]" />

                <span className="h-1.5 w-6 rounded-full bg-[var(--yellow-golden)]" />

                <span className="h-1.5 w-8 rounded-full bg-[var(--sky-blue)]" />

              </div>

            </div>

            {/* CONTENT */}

            <div className="p-6 md:p-8">

              {/* DETAILS */}

              <div className="overflow-hidden rounded-xl border border-[var(--green-primary)]/15">

                {summaryItems.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.label
                      }
                      className={`
                        px-5
                        py-4
                        sm:grid
                        sm:grid-cols-[220px_1fr]
                        sm:items-center
                        sm:gap-6

                        ${
                          index !==
                          summaryItems.length -
                            1
                            ? "border-b border-[var(--border-light)]"
                            : ""
                        }

                        ${
                          index %
                            2 ===
                          0
                            ? "bg-[var(--green-primary)]/[0.025]"
                            : "bg-white"
                        }
                      `}
                    >

                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--green-dark)]">
                        {
                          item.label
                        }
                      </span>

                      <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                        {
                          item.value
                        }
                      </span>

                    </div>
                  )
                )}

              </div>

              {/* PLANNED ROUTE */}

              <div className="mt-7">

                <h3 className="mb-4 text-[16px] font-bold text-[var(--green-dark)]">
                  Planned Route
                </h3>

                <div className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">

                  {plannedRoute.map(
                    (
                      location,
                      index
                    ) => {
                      const first =
                        index === 0;

                      const last =
                        index ===
                        plannedRoute.length -
                          1;

                      let label =
                        `Stop ${index}`;

                      if (first) {
                        label =
                          "Pickup";
                      } else if (last) {
                        label =
                          "Final Drop";
                      } else if (
                        booking.serviceType ===
                        "DAY_TOUR"
                      ) {
                        label =
                          "Tour Destination";
                      } else if (
                        booking.serviceType ===
                        "ROUND_TOUR"
                      ) {
                        label =
                          `Night ${index} Destination`;
                      }

                      return (
                        <div
                          key={`${location}-${index}`}
                          className="flex gap-4 border-b border-[var(--border-light)] px-5 py-4 last:border-b-0"
                        >

                          <div className="flex w-4 justify-center">

                            <span
                              className={`
                                mt-1
                                h-3
                                w-3
                                rounded-full

                                ${
                                  first
                                    ? "bg-[var(--green-primary)]"
                                    : last
                                      ? "bg-[var(--yellow-golden)]"
                                      : "bg-[var(--sky-blue)]"
                                }
                              `}
                            />

                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                              {
                                label
                              }
                            </p>

                            <p className="mt-1 text-[14px] font-semibold text-[var(--text-primary)]">
                              {
                                location
                              }
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/*
                NO CALCULATED DISTANCE IS DISPLAYED.

                The backend still calculates it
                because it is needed for pricing.

                This also satisfies your Round Tour
                requirement.
              */}

              {/* TOTAL PRICE */}

              <div className="relative mt-7 overflow-hidden rounded-xl border border-[var(--yellow-golden)]/40 bg-[var(--yellow-warm)]/[0.13] px-5 py-5 md:px-6">

                <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-[13px] font-bold text-[var(--green-dark)]">
                      Total
                      Transportation
                      Cost
                    </p>

                    <p className="mt-1 text-[12px] text-[var(--text-secondary)]">

                      {quoteLoading
                        ? "Calculating transportation cost..."
                        : quoteError
                          ? quoteError
                          : "Calculated using your route and selected vehicle."}

                    </p>

                  </div>

                  <span className="font-serif text-[26px] font-bold text-[var(--green-dark)]">

                    {quoteError
                      ? "Unavailable"
                      : money(
                          booking.totalAmount,
                          booking.currency
                        )}

                  </span>

                </div>

              </div>

              {/* CONFIRM */}

              <label
                className={`
                  mt-6
                  flex
                  cursor-pointer
                  items-start
                  gap-3
                  rounded-lg
                  border
                  px-4
                  py-4
                  text-[12px]

                  ${
                    confirmed
                      ? "border-[var(--green-primary)] bg-[var(--green-primary)]/[0.05]"
                      : "border-[var(--border-light)] bg-[var(--surface-soft)]"
                  }
                `}
              >

                <input
                  type="checkbox"
                  checked={
                    confirmed
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmed(
                      event.target
                        .checked
                    )
                  }
                  className="mt-[2px] h-4 w-4 accent-[var(--green-primary)]"
                />

                <span>
                  I confirm that the
                  details above are
                  correct and I agree
                  to submit this
                  reservation request.
                </span>

              </label>

              {/* BUTTONS */}

              <div className="mt-7 flex items-center justify-between">

                <Button
                  href="/customer/booking/customer-details"
                  variant="outline"
                >
                  Back
                </Button>

                <Button
                  onClick={() =>
                    void handleContinueToPayment()
                  }
                  disabled={
                    !confirmed ||
                    submitting ||
                    quoteLoading ||
                    Boolean(
                      quoteError
                    )
                  }
                  className="
                    min-w-[190px]
                    !bg-[var(--green-primary)]
                    !text-white
                    hover:!bg-[var(--green-dark)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  {submitting
                    ? "Creating Booking..."
                    : quoteLoading
                      ? "Calculating..."
                      : "Continue to Payment"}

                </Button>

              </div>

            </div>

          </div>

        </div>
      </section>

    </BookingPageShell>
  );
}