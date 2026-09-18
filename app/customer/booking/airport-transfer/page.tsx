import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function AirportTransferPage() {
  return (
    <BookingPageShell>
      {/* ==========================================
          TOP WHITE AREA
      ========================================== */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-6 pt-7 md:px-10">
          {/* Service Tabs */}
          <ServiceTabs active="airport-transfer" />
        </div>

        {/* Title + Step */}
        <div className="mt-10 border-b border-[var(--border-light)]">
          <div className="mx-auto w-full max-w-[1280px] px-6 pb-6 md:px-10">
            <BookingStepHeader
              title="Your Travel Details — For Airport Transfers"
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
          {/* Notice */}
          <div className="flex items-start gap-2 rounded-md border border-[#F1D8AA] bg-[#FFFEFA] px-4 py-3 text-[12px] font-medium text-[#26342B]">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="#E89A16"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-[1px] shrink-0"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5" />
              <path d="M12 16h.01" />
            </svg>

            <p>
              Please note: Either your Pickup or Dropoff Location must
              originate from or terminate at the Airport for this booking
              service.
            </p>
          </div>

          {/* Form */}
          <div className="mt-9 space-y-8">
            {/* Date */}
            <Select
              label="Date of Travel"
              placeholder="Select Date"
              options={[
                {
                  label: "June 15, 2026",
                  value: "2026-06-15",
                },
                {
                  label: "June 16, 2026",
                  value: "2026-06-16",
                },
                {
                  label: "June 17, 2026",
                  value: "2026-06-17",
                },
              ]}
            />

            {/* Passenger Count */}
            <Select
              label="Number of Passengers"
              placeholder="Select Passenger Count"
              options={[
                {
                  label: "1 Passenger",
                  value: "1",
                },
                {
                  label: "2 Passengers",
                  value: "2",
                },
                {
                  label: "3 Passengers",
                  value: "3",
                },
                {
                  label: "4 Passengers",
                  value: "4",
                },
                {
                  label: "5 Passengers",
                  value: "5",
                },
                {
                  label: "6+ Passengers",
                  value: "6+",
                },
              ]}
            />

            {/* Pickup */}
            <div>
              <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                Pickup Location
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66736A]"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

                <Input
                  className="pl-11"
                  placeholder="e.g., Bandaranaike International Airport (CMB) or Hotel Name"
                />
              </div>
            </div>

            {/* Drop */}
            <div>
              <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                Drop Location
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66736A]"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

                <Input
                  className="pl-11"
                  placeholder="e.g., Colombo Hotel, Galle Fort, Kandy Center"
                />
              </div>
            </div>

            {/* Vehicle */}
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

            {/* Luggage */}
            <Select
              label="Luggage Requirements"
              placeholder="Select Bag Count"
              options={[
                {
                  label: "No Luggage",
                  value: "0",
                },
                {
                  label: "1 Bag",
                  value: "1",
                },
                {
                  label: "2 Bags",
                  value: "2",
                },
                {
                  label: "3 Bags",
                  value: "3",
                },
                {
                  label: "4+ Bags",
                  value: "4+",
                },
              ]}
            />

            {/* Special Requirements */}
            <Textarea
              label="Special Requirements or Flight Information"
              placeholder="Enter flight number, required infant seats, extra surfboards, or transit instructions..."
            />

            {/* Continue Button */}
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