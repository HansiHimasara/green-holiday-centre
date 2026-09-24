"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

import {
  getBookingDraft,
  saveBookingDraft,
  type BookingServiceType,
} from "@/src/client/bookingDraft";

export default function CustomerDetailsPage() {
  const router =
    useRouter();

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    passportNumber,
    setPassportNumber,
  ] = useState("");

  const [
    specialRequirements,
    setSpecialRequirements,
  ] = useState("");

  const [
    serviceType,
    setServiceType,
  ] =
    useState<BookingServiceType>(
      "AIRPORT_TRANSFER"
    );

  // Load previously entered customer details
  // and current booking service
  useEffect(() => {
    const draft =
      getBookingDraft();

    if (draft.serviceType) {
      setServiceType(
        draft.serviceType
      );
    }

    if (!draft.customer) {
      return;
    }

    setFullName(
      draft.customer.fullName ??
        ""
    );

    setEmail(
      draft.customer.email ??
        ""
    );

    setPhone(
      draft.customer.phone ??
        ""
    );

    setPassportNumber(
      draft.customer
        .passportNumber ?? ""
    );

    setSpecialRequirements(
      draft.customer
        .specialRequirements ?? ""
    );
  }, []);

  // Decide which service tab should be active
  const serviceTab:
    | "airport-transfer"
    | "day-tour"
    | "round-tour" =
    serviceType ===
    "DAY_TOUR"
      ? "day-tour"
      : serviceType ===
          "ROUND_TOUR"
        ? "round-tour"
        : "airport-transfer";

  // Decide where Back button should go
  const backHref =
    serviceType ===
    "DAY_TOUR"
      ? "/customer/booking/day-tour"
      : serviceType ===
          "ROUND_TOUR"
        ? "/customer/booking/round-tour"
        : "/customer/booking/airport-transfer";

  // Save customer details before going to summary
  function handleContinue() {
    const normalizedFullName =
      fullName.trim();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const normalizedPhone =
      phone.trim();

    if (
      !normalizedFullName ||
      !normalizedEmail ||
      !normalizedPhone
    ) {
      window.alert(
        "Please enter your full name, email address and WhatsApp contact number."
      );

      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        normalizedEmail
      )
    ) {
      window.alert(
        "Please enter a valid email address."
      );

      return;
    }

    // Make sure Step 1 was completed
    const draft =
      getBookingDraft();

    if (
      !draft.serviceType ||
      !draft.vehicleTypeId ||
      !draft.travelDate
    ) {
      window.alert(
        "Please complete your travel details before continuing."
      );

      return;
    }

    saveBookingDraft({
      customer: {
        fullName:
          normalizedFullName,

        email:
          normalizedEmail,

        phone:
          normalizedPhone,

        passportNumber:
          passportNumber.trim(),

        specialRequirements:
          specialRequirements.trim(),
      },
    });

    router.push(
      "/customer/booking/summary"
    );
  }

  return (
    <BookingPageShell>
      {/* ==========================================
          TOP WHITE AREA
      ========================================== */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative z-10">

          {/* Service Tabs */}
          <div className="mx-auto w-full max-w-[1280px] px-6 pt-7 md:px-10">
            <ServiceTabs
              active={serviceTab}
            />
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
              value={fullName}
              onChange={(event) =>
                setFullName(
                  event.target.value
                )
              }
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

            {/* WhatsApp */}
            <Input
              label="WhatsApp Contact Number"
              type="tel"
              placeholder="+94 77 123 4567"
              value={phone}
              onChange={(event) =>
                setPhone(
                  event.target.value
                )
              }
            />

            {/* Passport */}
            <Input
              label="Passport Number"
              placeholder="Enter passport number"
              value={passportNumber}
              onChange={(event) =>
                setPassportNumber(
                  event.target.value
                )
              }
            />

            {/* Special Requests */}
            <Textarea
              label="Special Requests / Notes About Your Requirements"
              placeholder="Specify any special requests, medical requirements, child seat requirements, or anything else..."
              value={
                specialRequirements
              }
              onChange={(event) =>
                setSpecialRequirements(
                  event.target.value
                )
              }
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">

              <Button
                href={backHref}
                variant="outline"
                className="min-w-[90px]"
              >
                Back
              </Button>

              <Button
                onClick={
                  handleContinue
                }
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