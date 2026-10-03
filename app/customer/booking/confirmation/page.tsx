"use client";

import { apiFetch as fetch } from "@/src/client/apiFetch";

import {
  useEffect,
  useState,
} from "react";



import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Button from "@/components/ui/Button";

import {
  getBookingDraft,

  type BookingDraft,
} from "@/src/client/bookingDraft";

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<BookingDraft>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | undefined>();
  useEffect(() => {
    let cancelled = false;
    const saved = getBookingDraft();
    const params = new URLSearchParams(window.location.search);
    const id = params.get("booking") || saved.bookingId;
    const token = params.get("token") || saved.confirmationToken;
    async function load() {
      try {
        if (!id || !token) throw new Error("No saved reservation was found. Please complete your booking first.");
        const response = await fetch(`/api/booking-confirmation?booking=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load your reservation.");
        if (!cancelled) {
          setBooking(data.booking);
          if (String(saved.bookingId) === String(id)) setEmailSent(saved.emailSent);
        }
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load your reservation.");
      } finally { if (!cancelled) setLoaded(true); }
    }
    void load();
    return () => { cancelled = true; };
  }, []);
  if (!loaded || error) return <BookingPageShell>
    <section className="flex min-h-[500px] flex-col items-center justify-center gap-5 bg-[#F8F7F1] px-6">
      <p role={error ? "alert" : "status"} className="text-sm text-[var(--text-secondary)]">{error || "Loading your reservation..."}</p>
      {error && <Button href="/customer/booking/summary" variant="outline">Back to Booking</Button>}
    </section>
  </BookingPageShell>;

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
    { label: "Booking Reference", value: booking.bookingReference || "—" },
    { label: "Payment Status", value: booking.paymentStatus || "UNPAID" },
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
                title="Booking Confirmation"
                step={4}
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
                  {booking.status === "CANCELLED" ? "Reservation Cancelled" : "Reservation Received"}
                </h2>

                <p className="mt-1 text-[13px] text-white/70">
                  Reference: {booking.bookingReference}. Booking status: {booking.status}. Payment status: {booking.paymentStatus}.
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

                      Saved reservation total. Online payment is not available yet.

                    </p>

                  </div>

                  <span className="font-serif text-[26px] font-bold text-[var(--green-dark)]">

                    {money(booking.totalAmount, booking.currency)}

                  </span>

                </div>

              </div>

              <p role="status" className="mt-6 rounded-lg border border-[var(--border-light)] bg-[var(--surface-soft)] px-4 py-4 text-[12px]">
                {booking.paymentStatus === "PAID" ? "Payment received." : "No payment has been collected online. Please contact Green Holiday Centre to arrange payment and final travel confirmation."}
                {emailSent === true ? " Reservation details have been emailed to you." : emailSent === false ? " Email delivery was not confirmed. Please keep your booking reference." : ""}
              </p>
              <div className="mt-7 flex items-center justify-between">
                <Button href="/" variant="outline">Back to Home</Button>
                <Button onClick={() => window.print()} className="min-w-[190px] !bg-[var(--green-primary)] !text-white">Print Reservation</Button>
              </div>

            </div>

          </div>

        </div>
      </section>

    </BookingPageShell>
  );
}
