import Link from "next/link";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import StepIndicator from "@/components/bookings/StepIndicator";
import SummaryRow from "@/components/bookings/SummaryRow";

import Button from "@/components/ui/Button";

export default function BookingConfirmationPage() {
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
              <StepIndicator current={4} total={4} />
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
                    GH-2026-0142
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
                  value="Sarah Johnson"
                />

                <SummaryRow
                  label="Service"
                  value="Round Tour"
                />

                <SummaryRow
                  label="Vehicle"
                  value="Premium Hybrid Sedan"
                />

                <SummaryRow
                  label="Travel Date"
                  value="12 October 2026"
                />

                <SummaryRow
                  label="Duration"
                  value="6 Nights / 7 Days"
                />
              </div>

              {/* AMOUNT PAID */}
              <div className="mt-5 rounded-xl border border-[var(--yellow-golden)]/35 bg-[var(--yellow-warm)]/[0.10] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--green-dark)]">
                      Amount Paid
                    </p>

                    <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                      Transportation cost
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-[24px] font-bold text-[var(--green-dark)]">
                      $850.00
                    </span>

                    <span className="text-[10px] font-bold text-[var(--sky-blue)]">
                      USD
                    </span>
                  </div>
                </div>
              </div>

              {/* BOOKING REFERENCE NOTICE */}
              <div className="mt-4 rounded-lg border border-[var(--sky-blue)]/20 bg-[var(--sky-blue)]/[0.04] px-4 py-3">
                <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                  Please keep your booking reference{" "}
                  <span className="font-bold text-[var(--green-dark)]">
                    GH-2026-0142
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