"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import StepIndicator from "@/components/bookings/StepIndicator";
import SummaryRow from "@/components/bookings/SummaryRow";

import Button from "@/components/ui/Button";

import {
  getBookingDraft,
  type BookingDraft,
} from "@/src/client/bookingDraft";

function formatTravelDate(
  dateValue?: string
) {
  if (!dateValue) {
    return "Not provided";
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateValue;
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

function getServiceName(
  serviceType?: string
) {
  if (
    serviceType ===
    "AIRPORT_TRANSFER"
  ) {
    return "Airport Transfer";
  }

  if (
    serviceType ===
    "DAY_TOUR"
  ) {
    return "Day Tour";
  }

  if (
    serviceType ===
    "ROUND_TOUR"
  ) {
    return "Round Tour";
  }

  return "Not provided";
}

function getDuration(
  draft: BookingDraft
) {
  if (
    draft.serviceType ===
    "AIRPORT_TRANSFER"
  ) {
    return "Single Transfer";
  }

  if (
    draft.serviceType ===
    "DAY_TOUR"
  ) {
    return "1 Day";
  }

  if (
    draft.serviceType ===
      "ROUND_TOUR" &&
    draft.numberOfNights
  ) {
    return `${draft.numberOfNights} ${
      draft.numberOfNights ===
      1
        ? "Night"
        : "Nights"
    } / ${
      draft.numberOfNights +
      1
    } Days`;
  }

  return "Not provided";
}

export default function BookingConfirmationPage() {
  const [
    draft,
    setDraft,
  ] =
    useState<BookingDraft | null>(
      null
    );

  useEffect(() => {
    const savedDraft =
      getBookingDraft();

    setDraft(
      savedDraft
    );
  }, []);

  if (!draft) {
    return (
      <BookingPageShell>
        <section className="flex min-h-[500px] items-center justify-center bg-[#F8F7F1]">
          <p className="text-[13px] text-[var(--text-secondary)]">
            Loading booking confirmation...
          </p>
        </section>
      </BookingPageShell>
    );
  }

  const bookingReference =
    draft.bookingReference ||
    "Not Available";

  const customerName =
    draft.customer?.fullName ||
    "Not provided";

  const serviceName =
    getServiceName(
      draft.serviceType
    );

  const vehicleName =
    draft.vehicleName ||
    "Not provided";

  const travelDate =
    formatTravelDate(
      draft.travelDate
    );

  const duration =
    getDuration(
      draft
    );

  const totalAmount =
    draft.totalAmount ??
    850;

  const currency =
    draft.currency ??
    "USD";

  return (
    <BookingPageShell>
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-8 pt-8 md:px-10">
          <div className="flex items-center justify-between gap-8 border-b border-[var(--border-light)] pb-6">
            {/* LEFT — PAGE HEADING */}
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--green-primary)]">
                Almost Complete
              </p>

              <h1 className="mt-1 font-[var(--font-display)] text-[36px] font-semibold leading-tight text-[var(--green-dark)]">
                Booking Confirmation
              </h1>
            </div>

            {/* RIGHT — STEP INDICATOR */}
            <div className="shrink-0">
              <StepIndicator
                current={4}
                total={4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CONFIRMATION CONTENT
      ========================================== */}
      <section className="bg-[#F8F7F1] py-9 md:py-10">
        <div className="mx-auto w-full max-w-[760px] px-6 md:px-0">
          {/* SUCCESS MESSAGE */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--green-primary)] text-[24px] font-bold text-white shadow-[0_6px_18px_rgba(67,150,70,0.20)]">
              ✓
            </div>

            <br></br>

            <h2 className="mt-4 font-[var(--font-display)] text-[28px] font-semibold text-[var(--green-dark)]">
              Booking Confirmed!
            </h2>

            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
              Thank you for choosing Green Holiday.
            </p>
          </div>

          {/* ==========================================
              CONFIRMATION CARD
          ========================================== */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_15px_40px_rgba(7,91,69,0.08)]">
            {/* CARD HEADER */}
            <div className="bg-[var(--green-dark)] px-6 py-5 md:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--yellow-golden)]">
                    Reservation Details
                  </p>

                  <h3 className="mt-1 font-[var(--font-display)] text-[23px] font-semibold !text-white">
                    {bookingReference}
                  </h3>
                </div>

                <span className="rounded-full bg-[var(--yellow-golden)] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[var(--green-dark)]">
                  Confirmed
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="px-6 py-6 md:px-7">
              <div className="space-y-3.5">
                <SummaryRow
                  label="Customer Name"
                  value={customerName}
                />

                <SummaryRow
                  label="Service"
                  value={serviceName}
                />

                <SummaryRow
                  label="Vehicle"
                  value={vehicleName}
                />

                <SummaryRow
                  label="Travel Date"
                  value={travelDate}
                />

                <SummaryRow
                  label="Duration"
                  value={duration}
                />
              </div>

              {/* AMOUNT */}
              <div className="mt-5 rounded-xl border border-[var(--yellow-golden)]/35 bg-[var(--yellow-warm)]/[0.10] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--green-dark)]">
                      Booking Amount
                    </p>

                    <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                      Transportation cost
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-[24px] font-bold text-[var(--green-dark)]">
                      $
                      {totalAmount.toFixed(
                        2
                      )}
                    </span>

                    <span className="text-[10px] font-bold text-[var(--sky-blue)]">
                      {currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* BOOKING REFERENCE NOTICE */}
              <div className="mt-4 rounded-lg border border-[var(--sky-blue)]/20 bg-[var(--sky-blue)]/[0.04] px-4 py-3">
                <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                  Please keep your booking reference{" "}
                  <span className="font-bold text-[var(--green-dark)]">
                    {bookingReference}
                  </span>{" "}
                  for future communication.
                </p>
              </div>
            </div>
          </div>

          {/* ==========================================
              ACTION BUTTONS
          ========================================== */}
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
          <br></br>

          <p className="mt-4 text-center text-[11px] text-[var(--text-muted)]">
            Need help with your booking?{" "}
            <Link
              href="/customer/contact"
              className="font-semibold text-[var(--green-primary)] hover:text-[var(--green-dark)] hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </BookingPageShell>
  );
}