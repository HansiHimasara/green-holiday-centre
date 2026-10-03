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

  /* =======================================================
     LOAD SAVED CUSTOMER DETAILS
  ======================================================= */

  useEffect(() => {
    const draft =
      getBookingDraft();

    if (draft.serviceType) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize browser-only draft/URL state after hydration.
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

  /* =======================================================
     ACTIVE SERVICE TAB
  ======================================================= */

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

  /* =======================================================
     BACK BUTTON ROUTE
  ======================================================= */

  const backHref =
    serviceType ===
    "DAY_TOUR"
      ? "/customer/booking/day-tour"
      : serviceType ===
          "ROUND_TOUR"
        ? "/customer/booking/round-tour"
        : "/customer/booking/airport-transfer";

  /* =======================================================
     CONTINUE
  ======================================================= */

  function handleContinue() {
    const normalizedFullName =
      fullName.trim();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const normalizedPhone =
      phone.trim();

    const normalizedPassportNumber =
      passportNumber.trim();

    /*
     * ALL FOUR FIELDS ARE REQUIRED
     */
    if (
      !normalizedFullName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !normalizedPassportNumber
    ) {
      window.alert(
        "Please enter your name, email address, WhatsApp contact number, and passport number."
      );

      return;
    }

    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

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

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone.replace(/[\s().-]/g, ""))) {
      window.alert("Use an international phone number, for example +94771234567.");
      return;
    }
    if (!/^[A-Z0-9]{5,20}$/i.test(normalizedPassportNumber)) {
      window.alert("Enter a valid passport number (5 to 20 letters or digits).");
      return;
    }

    /* =====================================================
       MAKE SURE STEP 1 WAS COMPLETED
    ===================================================== */

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

    /* =====================================================
       SAVE CUSTOMER DETAILS
    ===================================================== */

    saveBookingDraft({
      customer: {
        fullName:
          normalizedFullName,

        email:
          normalizedEmail,

        phone:
          normalizedPhone,

        passportNumber:
          normalizedPassportNumber,

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

            {/* ====================================
                FULL NAME - REQUIRED
            ==================================== */}

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              required
              onChange={(event) =>
                setFullName(
                  event.target.value
                )
              }
            />

            {/* ====================================
                EMAIL - REQUIRED
            ==================================== */}

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={email}
              required
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

            <p className="text-sm text-[var(--text-secondary)]">Use an email you check regularly. Your tour details, invoice and payment information will be sent there.</p>

            {/* ====================================
                WHATSAPP - REQUIRED
            ==================================== */}

            <Input
              label="WhatsApp Contact Number"
              type="tel"
              placeholder="+94 77 123 4567"
              value={phone}
              required
              onChange={(event) =>
                setPhone(
                  event.target.value
                )
              }
            />

            {/* ====================================
                PASSPORT - REQUIRED
            ==================================== */}

            <Input
              label="Passport Number"
              placeholder="Enter passport number"
              value={passportNumber}
              required
              onChange={(event) =>
                setPassportNumber(
                  event.target.value
                )
              }
            />

            {/* ====================================
                SPECIAL REQUESTS - OPTIONAL
            ==================================== */}

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

            {/* ====================================
                NAVIGATION
            ==================================== */}

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
