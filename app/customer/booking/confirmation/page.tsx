"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import SummaryRow from "@/components/bookings/SummaryRow";
import Button from "@/components/ui/Button";

type Booking = {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality: string;
  serviceType: string;
  vehicleName?: string;
  travelDate: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
};

function label(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(window.location.search);

    const id = params.get("booking");
    const token = params.get("token");

    async function load() {
      try {
        const query = new URLSearchParams({
          booking: id || "",
          token: token || "",
        });

        const response = await fetch(
          `/api/booking-confirmation?${query}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok || !data.booking) {
          throw new Error(
            data.error || "Unable to load your booking.",
          );
        }

        if (!controller.signal.aborted) {
          setBooking(data.booking);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your booking.",
          );
        }
      }
    }

    void load();

    return () => controller.abort();
  }, []);

  const heading = !booking
    ? ""
    : ({
        PENDING: "Booking Received!",
        CONFIRMED: "Booking Confirmed!",
        CANCELLED: "Booking Cancelled",
        COMPLETED: "Booking Completed!",
      }[booking.status] ?? "Booking Details");

  return (
    <BookingPageShell>
      {/* PAGE HEADER */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-8 pt-8 md:px-10">
          <div className="flex items-center justify-between gap-8 border-b border-[var(--border-light)] pb-6">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--green-primary)]">
                Almost Complete
              </p>

              <h1 className="mt-1 font-[var(--font-display)] text-[36px] font-semibold leading-tight text-[var(--green-dark)]">
                Booking Confirmation
              </h1>
            </div>

            {/* STEP INDICATOR */}
            <div className="shrink-0">
              <div
                className="flex items-center gap-3"
                aria-label="Step 4 of 4"
              >
                <span className="text-[13px] font-bold text-[var(--green-primary)]">
                  Step 4 of 4
                </span>

                <div
                  className="flex items-center gap-1"
                  aria-hidden="true"
                >
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className="h-[5px] w-5 rounded-full bg-[var(--green-primary)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIRMATION CONTENT */}
      <section className="bg-[#F8F7F1] py-9 md:py-10">
        <div className="mx-auto w-full max-w-[760px] px-6 md:px-0">
          {!booking ? (
            <div
              className="text-center"
              role={error ? "alert" : "status"}
            >
              <p className="text-[13px] text-[var(--text-secondary)]">
                {error || "Loading your booking…"}
              </p>

              {error && (
                <Link
                  href="/customer/contact"
                  className="mt-4 inline-block text-[var(--green-primary)]"
                >
                  Contact us
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* BOOKING STATUS */}
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--green-primary)] text-[24px] font-bold text-white shadow-[0_6px_18px_rgba(67,150,70,0.20)]">
                  {booking.status === "CANCELLED" ? "×" : "✓"}
                </div>

                <br />

                <h2 className="mt-4 font-[var(--font-display)] text-[28px] font-semibold text-[var(--green-dark)]">
                  {heading}
                </h2>

                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  Thank you for choosing Green Holiday.
                </p>
              </div>

              {/* CONFIRMATION CARD */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_15px_40px_rgba(7,91,69,0.08)]">
                {/* CARD HEADER */}
                <div className="bg-[var(--green-dark)] px-6 py-5 md:px-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--yellow-golden)]">
                        Reservation Details
                      </p>

                      <h3 className="mt-1 font-[var(--font-display)] text-[23px] font-semibold !text-white">
                        {booking.bookingReference}
                      </h3>
                    </div>

                    <span className="rounded-full bg-[var(--yellow-golden)] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[var(--green-dark)]">
                      {label(booking.status)}
                    </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="px-6 py-6 md:px-7">
                  <div className="space-y-3.5">
                    <SummaryRow
                      label="Customer Name"
                      value={booking.customerName}
                    />

                    <SummaryRow
                      label="Email Address"
                      value={booking.customerEmail || "Not provided"}
                    />

                    <SummaryRow
                      label="Phone Number"
                      value={booking.customerPhone || "Not provided"}
                    />

                    <SummaryRow
                      label="Nationality"
                      value={
                        booking.customerNationality || "Not provided"
                      }
                    />

                    <SummaryRow
                      label="Service"
                      value={label(booking.serviceType)}
                    />

                    <SummaryRow
                      label="Vehicle"
                      value={
                        booking.vehicleName || "Vehicle unavailable"
                      }
                    />

                    <SummaryRow
                      label="Travel Date"
                      value={new Intl.DateTimeFormat("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Asia/Colombo",
                      }).format(new Date(booking.travelDate))}
                    />
                  </div>

                  {/* AMOUNT */}
                  <div className="mt-5 rounded-xl border border-[var(--yellow-golden)]/35 bg-[var(--yellow-warm)]/[0.10] px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--green-dark)]">
                          {booking.paymentStatus === "PAID"
                            ? "Amount Paid"
                            : "Total Amount"}
                        </p>

                        <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                          Transportation cost · Payment:{" "}
                          {label(booking.paymentStatus)}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-[24px] font-bold text-[var(--green-dark)]">
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(booking.totalAmount)}
                        </span>

                        <span className="text-[10px] font-bold text-[var(--sky-blue)]">
                          {booking.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOOKING REFERENCE NOTICE */}
                  <div className="mt-4 rounded-lg border border-[var(--sky-blue)]/20 bg-[var(--sky-blue)]/[0.04] px-4 py-3">
                    <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                      Please keep your booking reference{" "}
                      <span className="font-bold text-[var(--green-dark)]">
                        {booking.bookingReference}
                      </span>{" "}
                      for future communication.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button
                  href="/"
                  className="
                    min-w-[140px]
                    !bg-[var(--green-dark)]
                    !text-white
                    hover:!bg-[var(--green-forest)]
                  "
                >
                  Back to Home
                </Button>

                <Button
                  href="/customer/feedback"
                  variant="outline"
                  className="
                    min-w-[140px]
                    !border-[var(--green-primary)]
                    !text-[var(--green-dark)]
                    hover:!bg-[var(--green-primary)]
                    hover:!text-white
                  "
                >
                  Give Your Feedback
                </Button>
              </div>

              {/* CONTACT */}
              <br />

              <p className="mt-4 text-center text-[11px] text-[var(--text-muted)]">
                Need help with your booking?{" "}
                <Link
                  href="/customer/contact"
                  className="font-semibold text-[var(--green-primary)] hover:text-[var(--green-dark)] hover:underline"
                >
                  Contact us
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </BookingPageShell>
  );
}