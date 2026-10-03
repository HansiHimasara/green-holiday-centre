"use client";

import { apiFetch as fetch } from "@/src/client/apiFetch";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";

import Button from "@/components/ui/Button";

import {
  getBookingDraft,
  saveBookingDraft,
  type BookingDraft,
} from "@/src/client/bookingDraft";

type BookingQuoteResponse = {
  totalAmount?: number;
  currency?: string;
  route?: {
    actualKilometres?: number;
    durationMinutes?: number;
    extraKilometres?: number;
  };
  error?: string;
};

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
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function getServiceName(
  serviceType?: string,
  numberOfNights?: number
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
    if (
      numberOfNights &&
      numberOfNights > 0
    ) {
      return `Round Tour / ${numberOfNights} Nights`;
    }

    return "Round Tour";
  }

  return "Not provided";
}

function formatCurrencyAmount(
  amount: number | null,
  currency: string
) {
  if (amount === null) {
    return "Calculating...";
  }

  return `${currency} ${amount.toFixed(
    2
  )}`;
}

export default function BookingSummaryPage() {
  const router =
    useRouter();

  const [
    draft,
    setDraft,
  ] =
    useState<BookingDraft | null>(
      null
    );

  const [
    confirmed,
    setConfirmed,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);
  const [emailDelivered, setEmailDelivered] = useState<boolean | null>(null);

  const [
    quoteLoading,
    setQuoteLoading,
  ] =
    useState(false);

  const [
    quoteError,
    setQuoteError,
  ] =
    useState("");

  useEffect(() => {
    const savedDraft =
      getBookingDraft();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize browser-only draft/URL state after hydration.
    setDraft(
      savedDraft
    );
  }, []);

  const { serviceType, vehicleTypeId, pickupLocation, dropoffLocation, destinations } = draft || {};

  useEffect(() => {
    if (!serviceType) {
      return;
    }

    let cancelled = false;

    const loadQuote = async () => {
      try {
        setQuoteLoading(
          true
        );
        setQuoteError("");

        const waypoints = serviceType === "AIRPORT_TRANSFER" ? [] : destinations ?? [];

        const response =
          await fetch(
            "/api/booking-quote",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(
                  {
                    serviceType:
                      serviceType,
                    vehicleTypeId:
                      vehicleTypeId,
                    pickupLocation:
                      pickupLocation,
                    dropoffLocation:
                      dropoffLocation,
                    waypoints,
                  }
                ),
            }
          );

        const data =
          (await response.json()) as BookingQuoteResponse;

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to calculate booking price."
          );
        }

        if (
          typeof data.totalAmount !==
            "number" ||
          !Number.isFinite(
            data.totalAmount
          ) ||
          !data.currency
        ) {
          throw new Error(
            "A valid price could not be calculated."
          );
        }

        if (cancelled) {
          return;
        }

        const updatedValues: Partial<BookingDraft> = {
          totalAmount:
            data.totalAmount,
          currency:
            data.currency,
          actualKilometres:
            data.route
              ?.actualKilometres,
          routeDurationMinutes:
            data.route
              ?.durationMinutes,
        };

        saveBookingDraft(
          updatedValues
        );

        setDraft(
          (currentDraft) =>
            currentDraft
              ? {
                  ...currentDraft,
                  ...updatedValues,
                }
              : currentDraft
        );
      } catch (error) {
        // Expected validation failures are displayed inline below.

        if (!cancelled) {
          setQuoteError(
            error instanceof Error
              ? error.message
              : "Unable to calculate booking price."
          );
        }
      } finally {
        if (!cancelled) {
          setQuoteLoading(
            false
          );
        }
      }
    };

    void loadQuote();

    return () => {
      cancelled = true;
    };
  }, [
    serviceType,
    vehicleTypeId,
    pickupLocation,
    dropoffLocation,
    destinations,
  ]);

  if (!draft) {
    return (
      <BookingPageShell>
        <section className="flex min-h-[500px] items-center justify-center bg-[#F8F7F1]">
          <p className="text-sm text-[var(--text-secondary)]">
            Loading booking summary...
          </p>
        </section>
      </BookingPageShell>
    );
  }

  const serviceTab =
    draft.serviceType ===
    "DAY_TOUR"
      ? "day-tour"
      : draft.serviceType ===
          "ROUND_TOUR"
        ? "round-tour"
        : "airport-transfer";

  const isRoundTour =
    draft.serviceType === "ROUND_TOUR";

  const totalAmount =
    !quoteLoading &&
    !quoteError &&
    typeof draft.totalAmount ===
      "number" &&
    Number.isFinite(
      draft.totalAmount
    )
      ? draft.totalAmount
      : null;

  const currency =
    draft.currency ??
    "USD";

  const distanceText =
    !quoteLoading &&
    !quoteError &&
    typeof draft.actualKilometres ===
      "number" &&
    Number.isFinite(
      draft.actualKilometres
    )
      ? `${draft.actualKilometres.toFixed(
          2
        )} km`
      : quoteLoading
        ? "Calculating..."
        : "Not calculated";

  const summaryItems = [
    {
      label: "Tour Type",

      value:
        getServiceName(
          draft.serviceType,
          draft.numberOfNights
        ),

      color: "green",
    },

    {
      label:
        "Selected Vehicle",

      value:
        draft.vehicleName ||
        "Not provided",

      color: "yellow",
    },

    {
      label: "Travel Date",

      value:
        formatTravelDate(
          draft.travelDate
        ),

      color: "green",
    },

    {
      label:
        "Total Passengers",

      value:
        draft.passengerCount
          ? `${draft.passengerCount} ${
              draft.passengerCount === 1
                ? "Passenger"
                : "Passengers"
            }`
          : "Not provided",

      color: "yellow",
    },

    {
      label:
        "Luggage Capacity",

      value:
        draft.luggageCount !== undefined
          ? `${draft.luggageCount} ${
              draft.luggageCount === 1
                ? "Bag"
                : "Bags"
            }`
          : "Not provided",

      color: "green",
    },

    ...(
      isRoundTour
        ? []
        : [
            {
              label: "Pickup Location",

              value:
                draft.pickupLocation ||
                "Not provided",

              color: "blue",
            },

            {
              label: "Drop Location",

              value:
                draft.dropoffLocation ||
                "Not provided",

              color: "blue",
            },

            {
              label: "Calculated Distance",

              value: distanceText,

              color: "blue",
            },
          ]
    ),

    {
      label:
        "Planned Route",

      value:
        draft.destinations &&
        draft.destinations.length > 0
          ? draft.destinations.join(
              " → "
            )
          : "Not applicable",

      color: "blue",
    },
  ];


  async function createBooking(
    nextPage:
      | "reservation"
      | "payment"
  ) {
    if (submitting || quoteLoading || quoteError) return;
    const currentDraft =
      draft;

    if (!currentDraft) {
      window.alert(
        "Booking details are not available. Please enter your travel details again."
      );

      return;
    }

    if (!confirmed) {
      window.alert(
        "Please confirm that your booking details are correct."
      );

      return;
    }

    if (
      !currentDraft.serviceType ||
      !currentDraft.vehicleTypeId ||
      !currentDraft.travelDate ||
      !currentDraft.passengerCount ||
      !currentDraft.customer
    ) {
      window.alert(
        "Your booking details are incomplete. Please go back and complete the previous steps."
      );

      return;
    }

    const bookingTotalAmount =
      typeof currentDraft.totalAmount ===
              "number" &&
            Number.isFinite(
              currentDraft.totalAmount
            )
          ? currentDraft.totalAmount
          : totalAmount;

    const bookingCurrency = currentDraft.currency ?? currency;

    if (
      bookingTotalAmount === null
    ) {
      window.alert(
        "Please wait until the system calculates the trip price."
      );

      return;
    }

    if (
      quoteError
    ) {
      window.alert(
        quoteError
      );

      return;
    }

    const customer =
      currentDraft.customer;

    if (currentDraft.bookingId && currentDraft.bookingReference) {
      router.push(currentDraft.confirmationToken ? `/customer/booking/confirmation?booking=${currentDraft.bookingId}&token=${encodeURIComponent(currentDraft.confirmationToken)}` : "/customer/booking/confirmation");
      return;
    }

    const requestId = currentDraft.requestId || crypto.randomUUID();
    saveBookingDraft({ requestId });
    setDraft({ ...currentDraft, requestId });
    try {
      setSubmitting(
        true
      );

      const response =
        await fetch(
          "/api/bookings",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  serviceType:
                    currentDraft.serviceType,

                  vehicleTypeId:
                    currentDraft.vehicleTypeId,

                  travelDate:
                    currentDraft.travelDate,

                  returnDate:
                    currentDraft.returnDate,

                  passengerCount:
                    currentDraft.passengerCount,

                  luggageCount:
                    currentDraft.luggageCount ??
                    0,

                  numberOfNights:
                    currentDraft.numberOfNights,

                  pickupLocation:
                    currentDraft.pickupLocation,

                  dropoffLocation:
                    currentDraft.dropoffLocation,

                  flightNumber:
                    currentDraft.flightNumber,

                  specialRequests:
                    currentDraft.specialRequests,

                  destinations:
                    currentDraft.destinations ??
                    [],

                  totalAmount:
                    bookingTotalAmount,

                  currency:
                    bookingCurrency,

                  requestId,
                  reservationOnly: nextPage !== "payment",
                  customer: {
                    fullName:
                      customer.fullName,

                    email:
                      customer.email,

                    phone:
                      customer.phone,

                    passportNumber:
                      customer.passportNumber,

                    nationality:
                      customer.nationality,

                    address:
                      customer.address,

                    specialRequirements:
                      customer.specialRequirements,
                  },
                }
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        window.alert(
          data.error ||
            "Unable to create your booking."
        );

        return;
      }

      setEmailDelivered(Boolean(data.emailSent));
      if (!data.booking) {
        window.alert(
          "Booking could not be created."
        );

        return;
      }

      const savedAmount =
        typeof data.booking
          .totalAmount === "number"
          ? data.booking
              .totalAmount
          : bookingTotalAmount;

      const savedCurrency =
        data.booking.currency ||
        bookingCurrency;

      saveBookingDraft({
        confirmationToken: data.confirmationToken,
        emailSent: Boolean(data.emailSent),
        bookingId:
          data.booking.id,

        bookingReference:
          data.booking
            .bookingReference,

        totalAmount:
          savedAmount,

        currency:
          savedCurrency,
      });

      setDraft({
        ...currentDraft,
        requestId,
        bookingId:
          data.booking.id,

        bookingReference:
          data.booking
            .bookingReference,

        totalAmount:
          savedAmount,

        currency:
          savedCurrency,
      });

      router.push(`/customer/booking/confirmation?booking=${data.booking.id}&token=${encodeURIComponent(data.confirmationToken)}`);
    } catch (error) {
      console.error(
        "Booking submission error:",
        error
      );

      window.alert(
        "Something went wrong while creating your booking. Please try again."
      );
    } finally {
      setSubmitting(
        false
      );
    }
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
              active={
                serviceTab
              }
            />
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
                  {isRoundTour
                    ? "Please review your selected services and travel information before submitting your reservation."
                    : "Please review your selected services and travel information before continuing to payment."}
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
                {summaryItems.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.label
                      }
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
                          index !==
                          summaryItems.length -
                            1
                            ? "border-b border-[var(--border-light)]"
                            : ""
                        }
                        ${
                          index %
                            2 ===
                          0
                            ? "bg-[var(--green-primary)]/[0.025]"
                            : "bg-white"
                        }
                      `}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--green-dark)]">
                        {
                          item.label
                        }
                      </span>

                      <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                        {
                          item.value
                        }
                      </span>
                    </div>
                  )
                )}
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
                      {quoteLoading
                          ? "Calculating the road distance and final price..."
                          : quoteError
                            ? quoteError
                            : "Calculated using your selected route, exact pickup and drop-off locations."}
                    </p>
                  </div>

                  <span className="whitespace-nowrap font-serif text-[26px] font-bold text-[var(--green-dark)]">
                    {quoteError
                      ? "Unavailable"
                      : formatCurrencyAmount(totalAmount, currency)}
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
                  checked={
                    confirmed
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmed(
                      event.target
                        .checked
                    )
                  }
                  className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--green-primary)]"
                />

                <span>
                  {isRoundTour
                    ? "I confirm that the details above are correct and I agree to submit this reservation request."
                    : "I confirm that the details above are correct and I agree to submit this unpaid reservation request."}
                </span>
              </label>

              {draft.bookingId && <p role="status" className="mt-6 rounded-lg border border-[var(--green-primary)]/20 bg-[var(--surface-soft)] p-4 text-sm font-semibold text-[var(--green-dark)]">Reservation saved: {draft.bookingReference}. {emailDelivered === true ? "Check your email for tour details and the reservation link." : "Email delivery has not been confirmed. Contact the travel office with this reference."}</p>}

              {/* ==========================================
                  BUTTONS
              ========================================== */}
              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  href="/customer/booking/customer-details"
                  variant="outline"
                  className="min-w-[90px]"
                >
                  Back
                </Button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    variant="outline"
                    onClick={() =>
                      void createBooking(
                        "reservation"
                      )
                    }
                    disabled={
                      submitting ||
                      quoteLoading || totalAmount === null
                    }
                    className="min-w-[180px]"
                  >
                    {submitting
                      ? "Please Wait..."
                      : quoteLoading
                        ? "Calculating..."
                        : "Make a Reservation"}
                  </Button>

                  <Button
                      onClick={() =>
                        void createBooking(
                          "payment"
                        )
                      }
                      disabled={
                        submitting ||
                        quoteLoading ||
                        totalAmount === null
                      }
                      className="min-w-[180px]"
                    >
                      {submitting
                        ? "Please Wait..."
                        : quoteLoading
                          ? "Calculating..."
                          : "Submit & View Confirmation"}
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BookingPageShell>
  );
}
