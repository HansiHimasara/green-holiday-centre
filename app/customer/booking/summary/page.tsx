import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Button from "@/components/ui/Button";

const summaryItems = [
  {
    label: "Tour Type",
    value: "Customized Private Tour / 3 Nights",
  },
  {
    label: "Selected Vehicle",
    value: "Executive Minivan",
  },
  {
    label: "Travel Date",
    value: "June 15, 2026",
  },
  {
    label: "Total Passengers",
    value: "4 Adults",
  },
  {
    label: "Luggage Capacity",
    value: "4 Bags",
  },
  {
    label: "Pickup Location",
    value: "Bandaranaike International Airport (CMB)",
  },
  {
    label: "Drop Location",
    value: "Colombo City Hotel",
  },
  {
    label: "Planned Route",
    value: "Sigiriya → Kandy → Galle → Colombo",
  },
];

export default function BookingSummaryPage() {
  return (
    <BookingPageShell>
      {/* ==========================================
          TOP WHITE AREA
      ========================================== */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-6 pt-7 md:px-10">
          <ServiceTabs active="airport-transfer" />
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
      </section>

      {/* ==========================================
          SUMMARY AREA
      ========================================== */}
      <section className="bg-[#F5F7F5] py-9">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="rounded-lg border border-[var(--border-light)] bg-white p-6 md:p-7">
            <h2 className="text-[18px] font-bold text-[var(--green-dark)]">
              Review Your Travel Details
            </h2>

            {/* Summary Rows */}
            <div className="mt-5 divide-y divide-[var(--border-light)]">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-2 py-3.5 text-[13px] sm:grid-cols-[190px_1fr]"
                >
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {item.label}
                  </span>

                  <span className="font-bold text-[var(--text-primary)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-5 rounded-md border border-[#CFE2CC] bg-[#F5FBF3] px-5 py-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[13px] font-bold text-[var(--green-dark)]">
                    Total Transportation Cost
                  </p>

                  <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
                    Estimated transportation cost based on your selected trip
                    information.
                  </p>
                </div>

                <span className="font-serif text-[22px] font-bold text-[var(--green-primary)]">
                  $850.00 USD
                </span>
              </div>
            </div>

            {/* Confirmation */}
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-[12px] text-[var(--text-secondary)]">
              <input
                type="checkbox"
                className="mt-[2px] accent-[var(--green-primary)]"
              />

              <span>
                I confirm that the details above are correct and I agree to
                continue to the payment process.
              </span>
            </label>

            {/* Buttons */}
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
      </section>
    </BookingPageShell>
  );
}