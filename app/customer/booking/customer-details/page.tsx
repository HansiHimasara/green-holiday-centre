import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

export default function CustomerDetailsPage() {
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
                title="Your Personal Details"
                step={2}
                totalSteps={4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FORM AREA
      ========================================== */}
      <section className="relative overflow-hidden bg-[#F5F7F5] py-10">
        <DecorativePattern position="bottom-right" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="space-y-8">
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
            />

            {/* WhatsApp */}
            <Input
              label="WhatsApp Contact Number"
              type="tel"
              placeholder="+94 77 123 4567"
            />

            {/* Passport */}
            <Input
              label="Passport Number"
              placeholder="Enter passport number"
            />

            {/* Special Requests */}
            <Textarea
              label="Special Requests / Notes About Your Requirements"
              placeholder="Specify any special requests, medical requirements, child seat requirements, or anything else..."
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">
              <Button
                href="/customer/booking/airport-transfer"
                variant="outline"
                className="min-w-[90px]"
              >
                Back
              </Button>

              <Button
                href="/customer/booking/summary"
                className="min-w-[190px]"
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