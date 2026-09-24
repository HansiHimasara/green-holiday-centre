export type BookingServiceType =
  | "AIRPORT_TRANSFER"
  | "DAY_TOUR"
  | "ROUND_TOUR";

export type BookingCustomer = {
  fullName: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
  address?: string;
  specialRequirements?: string;
};

export type BookingDraft = {
  serviceType?: BookingServiceType;

  pricingId?: number;

  vehicleTypeId?: number;
  vehicleName?: string;

  travelDate?: string;
  returnDate?: string;

  passengerCount?: number;
  luggageCount?: number;
  numberOfNights?: number;

  pickupLocation?: string;
  dropoffLocation?: string;
  flightNumber?: string;

  specialRequests?: string;

  destinations?: string[];

  customer?: BookingCustomer;

  actualKilometres?: number;
  routeDurationMinutes?: number;

  totalAmount?: number;
  currency?: string;

  bookingId?: number;
  bookingReference?: string;
};

const STORAGE_KEY =
  "greenholiday_booking_draft";

export function getBookingDraft(): BookingDraft {
  if (
    typeof window ===
    "undefined"
  ) {
    return {};
  }

  try {
    const stored =
      window.sessionStorage.getItem(
        STORAGE_KEY
      );

    if (!stored) {
      return {};
    }

    return JSON.parse(
      stored
    ) as BookingDraft;
  } catch {
    return {};
  }
}

export function saveBookingDraft(
  updates: Partial<BookingDraft>
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const current =
    getBookingDraft();

  const updated: BookingDraft = {
    ...current,
    ...updates,
  };

  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}

export function clearBookingDraft() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.sessionStorage.removeItem(
    STORAGE_KEY
  );
}