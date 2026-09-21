import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import SecureBadge from "@/components/bookings/SecureBadge";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

export default function PaymentPage() {
  return (
    <BookingPageShell>
      {/* ==========================================
          HEADER
      ========================================== */}
      <section className="bg-white">
        <DecorativePattern position="bottom-right" />
        
        <div className="mx-auto w-full max-w-[1180px] px-8 pt-6 md:px-10">
          <ServiceTabs active="airport-transfer" />
        </div>

        <div className="mx-auto mt-8 w-full max-w-[1180px] border-b border-[var(--border-light)] px-8 pb-5 md:px-10">
          <BookingStepHeader
            title="Payment Gateway"
            step={4}
            totalSteps={4}
          />
        </div>
      </section>

      {/* ==========================================
          PAYMENT PAGE
      ========================================== */}
      <section className="bg-[#F8F7F1] py-8 md:py-10">
        <div className="mx-auto w-full max-w-[780px] px-6 md:px-8">

          {/* INTRO */}
          <div className="mb-6 text-center">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[var(--green-primary)]">
              Almost There
            </p>
          </div>

          {/* ==========================================
              PAYMENT CARD
          ========================================== */}
          <div className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_12px_35px_rgba(7,91,69,0.08)]">

            {/* PAYMENT HEADER */}
            <div className="bg-[var(--green-dark)] px-6 py-5 md:px-7">
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--yellow-golden)]">
                    Booking Reference
                  </p>

                  <h2 className="mt-1 font-serif text-[22px] font-semibold !text-white">
                    GH-2026/9421
                  </h2>
                </div>

                <SecureBadge />

              </div>
            </div>

            {/* FORM */}
            <div className="px-6 py-6 md:px-7">

              <div className="space-y-4">

                <Input
                  label="Cardholder Name"
                  placeholder="Enter cardholder name"
                />

                <Input
                  label="Card Number"
                  placeholder="0000 0000 0000 0000"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Expiry Date"
                    placeholder="MM / YY"
                  />

                  <Input
                    label="CVV"
                    placeholder="123"
                  />
                </div>

              </div>

              {/* SECURITY NOTICE */}
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--yellow-golden)]/20 bg-[var(--yellow-golden)]/[0.04] px-4 py-3">

                <div className="mt-0.5 h-6 w-1 shrink-0 rounded-full bg-[var(--yellow-golden)]" />

                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[var(--green-dark)]">
                    Secure Payment
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-[var(--text-secondary)]">
                    Your payment information is securely processed and
                    protected.
                  </p>
                </div>

              </div>

              {/* PAYMENT BUTTON */}
              <Button
                href="/customer/booking/confirmation"
                className="
                  mt-5
                  w-full
                  !bg-[var(--sky-blue)]
                  !text-black
                  py-3
                  text-[12px]
                  font-extrabold
                  hover:!bg-[var(--green-forest)]
                  hover:!text-white
                "
              >
                Complete Payment — $850.00 USD
              </Button>

              {/* BACK */}
              <div className="mt-5 flex items-center justify-between border-t border-[var(--border-light)] pt-4">

                <Button
                  href="/customer/booking/summary"
                  variant="outline"
                  className="
                    min-w-[80px]
                    !border-[var(--green-primary)]
                    !text-[var(--green-dark)]
                    hover:!bg-[var(--green-primary)]
                    hover:!text-white
                  "
                >
                  Back
                </Button>

                <span className="text-[9px] font-semibold text-[var(--green-primary)]">
                  Secure checkout
                </span>

              </div>

            </div>
          </div>

          {/* FOOT NOTE */}
          <br></br>
          <p className="mt-5 text-center text-[11px] text-[var(--text-muted)]">
            We support Visa, Mastercard, American Express, and major international cards.
          </p>

        </div>
      </section>
    </BookingPageShell>
  );
}