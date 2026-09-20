import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

const summaryItems = [
  {
    label: "Tour Type",
    value: "Customized Private Tour / 3 Nights",
    color: "green",
  },
  {
    label: "Selected Vehicle",
    value: "Executive Minivan",
    color: "yellow",
  },
  {
    label: "Travel Date",
    value: "June 15, 2026",
    color: "green",
  },
  {
    label: "Total Passengers",
    value: "4 Adults",
    color: "yellow",
  },
  {
    label: "Luggage Capacity",
    value: "4 Bags",
    color: "green",
  },
  {
    label: "Pickup Location",
    value: "Bandaranaike International Airport (CMB)",
    color: "blue",
  },
  {
    label: "Drop Location",
    value: "Colombo City Hotel",
    color: "blue",
  },
  {
    label: "Planned Route",
    value: "Sigiriya → Kandy → Galle → Colombo",
    color: "blue",
  },
];

export default function BookingSummaryPage() {
  return (
    <BookingPageShell>
      {/* ==========================================
          TOP WHITE AREA
      ========================================== */}
      <section className="relative overflow-hidden bg-white">

        <div className="relative z-10">
          {/* Service Tabs */}
          <div className="mx-auto w-full max-w-[1280px] px-6 pt-7 md:px-10">
            <ServiceTabs active="airport-transfer" />
          </div>

          {/* Step Header */}
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

      {/* ==========================================
          SUMMARY AREA
      ========================================== */}
      <section className="relative overflow-hidden bg-[#F8F7F1] py-10">

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10">
          {/* ==========================================
              MAIN SUMMARY CARD
          ========================================== */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_15px_45px_rgba(7,91,69,0.08)]">
            {/* ==========================================
                COLOUR HEADER
            ========================================== */}
            <div className="relative overflow-hidden bg-[var(--green-deep)] px-6 py-6 md:px-8">
              {/* Decorative circles */}
              <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-[var(--yellow-golden)]/20" />

              <div className="absolute -bottom-16 right-20 h-36 w-36 rounded-full bg-[var(--sky-blue)]/15" />

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-golden)]" />

                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                    Your Journey
                  </p>
                </div>

                <h2 className="mt-2 font-serif text-[24px] font-semibold !text-white">
                  Review Your Travel Details
                </h2>

                <p className="mt-1 max-w-[600px] text-[13px] leading-5 text-white/70">
                  Please review your selected services and travel information
                  before continuing to payment.
                </p>
              </div>

              {/* Three colour indicators */}
              <div className="relative z-10 mt-5 flex items-center gap-2">
                <span className="h-1.5 w-10 rounded-full bg-[var(--green-light)]" />
                <span className="h-1.5 w-6 rounded-full bg-[var(--yellow-golden)]" />
                <span className="h-1.5 w-8 rounded-full bg-[var(--sky-blue)]" />
              </div>
            </div>
            
            {/* ==========================================
                SUMMARY DETAILS
            ========================================== */}
            <div className="p-6 md:p-8">
              <div className="overflow-hidden rounded-xl border border-[var(--green-primary)]/15">
                {summaryItems.map((item, index) => (
                  <div
                    key={item.label}
                    className={`
                      flex
                      flex-col
                      gap-1
                      px-5
                      py-4
                      sm:grid
                      sm:grid-cols-[220px_1fr]
                      sm:items-center
                      sm:gap-6
                      ${
                        index !== summaryItems.length - 1
                          ? "border-b border-[var(--border-light)]"
                          : ""
                      }
                      ${
                        index % 2 === 0
                          ? "bg-[var(--green-primary)]/[0.025]"
                          : "bg-white"
                      }
                    `}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--green-dark)]">
                      {item.label}
                    </span>

                    <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* ==========================================
                  TOTAL PRICE
              ========================================== */}
              <div
                className="
                  relative
                  mt-7
                  overflow-hidden
                  rounded-xl
                  border
                  border-[var(--yellow-golden)]/40
                  bg-[var(--yellow-warm)]/[0.13]
                  px-5
                  py-5
                  md:px-6
                "
              >
                {/* Subtle Decorative Circle */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-12
                    h-32
                    w-32
                    rounded-full
                    bg-[var(--yellow-golden)]/15
                  "
                />

                <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[13px] font-bold text-[var(--green-dark)]">
                      Total Transportation Cost
                    </p>

                    <p className="mt-1 max-w-[500px] text-[12px] leading-5 text-[var(--text-secondary)]">
                      Estimated transportation cost based on your selected
                      trip information.
                    </p>
                  </div>

                  <span className="whitespace-nowrap font-serif text-[26px] font-bold text-[var(--green-dark)]">
                    $850.00 USD
                  </span>
                </div>
              </div>

              {/* ==========================================
                  CONFIRMATION
              ========================================== */}
              <label
                className="
                  mt-6
                  flex
                  cursor-pointer
                  items-start
                  gap-3
                  rounded-lg
                  border
                  border-[var(--border-light)]
                  bg-[var(--surface-soft)]
                  px-4
                  py-4
                  text-[12px]
                  leading-5
                  text-[var(--text-secondary)]
                  transition-colors
                  hover:bg-[var(--green-primary)]/[0.03]
                "
              >
                <input
                  type="checkbox"
                  className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--green-primary)]"
                />

                <span>
                  I confirm that the details above are correct and I agree to
                  continue to the payment process.
                </span>
              </label>

              {/* ==========================================
                  BUTTONS
              ========================================== */}
              <div className="mt-7 flex items-center justify-between">
                <Button
                  href="/customer/booking/customer-details"
                  variant="outline"
                  className="min-w-[90px]"
                >
                  Back
                </Button>

                <Button
                  href="/customer/booking/payment"
                  className="min-w-[180px]"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BookingPageShell>
  );
}