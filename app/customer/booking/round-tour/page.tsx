import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import RoundTourNights from "@/components/bookings/RoundTourNights";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function RoundTourPage() {
  return (
    <BookingPageShell>
      {/* ==========================================
          TOP WHITE AREA
      ========================================== */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-6 pt-7 md:px-10">
          <ServiceTabs active="round-tour" />
        </div>

        <div className="mt-10 border-b border-[var(--border-light)]">
          <div className="mx-auto w-full max-w-[1280px] px-6 pb-6 md:px-10">
            <BookingStepHeader
              title="Your Travel Details — For Round Tours"
              step={1}
              totalSteps={4}
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          FORM AREA
      ========================================== */}
      <section className="bg-[#F5F7F5] py-9">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="space-y-8">
            <Input
              label="Start Date"
              type="date"
            />

            <Select
              label="Number of Passengers"
              placeholder="Select Passenger Count"
              options={[
                { label: "1 Passenger", value: "1" },
                { label: "2 Passengers", value: "2" },
                { label: "3 Passengers", value: "3" },
                { label: "4 Passengers", value: "4" },
                { label: "5 Passengers", value: "5" },
                { label: "6+ Passengers", value: "6+" },
              ]}
            />

            <Select
              label="Selected Vehicle Preference"
              placeholder="Search & Select Fleet Class"
              options={[
                {
                  label: "Premium Sedan",
                  value: "premium-sedan",
                },
                {
                  label: "Executive Minivan",
                  value: "executive-minivan",
                },
                {
                  label: "Luxury SUV",
                  value: "luxury-suv",
                },
              ]}
            />

            <Select
              label="Luggage Requirements"
              placeholder="Select Bag Count"
              options={[
                { label: "No Luggage", value: "0" },
                { label: "1 Bag", value: "1" },
                { label: "2 Bags", value: "2" },
                { label: "3 Bags", value: "3" },
                { label: "4+ Bags", value: "4+" },
              ]}
            />

            {/* Night Destinations */}
            <div>
              <div className="mb-5">
                <h2 className="text-[18px] font-bold text-[var(--green-dark)]">
                  Night Destinations
                </h2>

                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  Three nights are shown initially. Add another night only if
                  your tour requires it.
                </p>
              </div>

              <RoundTourNights />
            </div>

            <Textarea
              label="Special Notes or Requirements"
              placeholder="Tell us about preferred destinations, activities, accessibility requirements, or anything else..."
            />

            <div className="flex justify-end pt-1">
              <Button
                href="/customer/booking/customer-details"
                className="min-w-[190px] px-6 py-3"
              >
                Continue to Next Step
              </Button>
            </div>
          </div>
        </div>
      </section>
    </BookingPageShell>
  );
}