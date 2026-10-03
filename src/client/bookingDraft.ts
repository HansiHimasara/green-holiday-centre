export type BookingServiceType =
  | "AIRPORT_TRANSFER"
  | "DAY_TOUR"
  | "ROUND_TOUR";

export type BookingCustomer = {
  fullName: string;
  email: string;
  phone: string;

  // Required
  passportNumber: string;

  nationality?: string;
  address?: string;
  specialRequirements?: string;
};

export type BookingDraft = {
  requestId?: string;
  confirmationToken?: string;
  emailSent?: boolean;
  status?: string;
  paymentStatus?: string;
  serviceType?: BookingServiceType;

  vehicleTypeId?: number;
  vehicleName?: string;

  travelDate?: string;
  returnDate?: string;

  passengerCount?: number;
  luggageCount?: number;

  // Round Tour only
  numberOfNights?: number;

  /*
   * Keep FULL Photon location strings here.
   *
   * Example:
   * Sigiriya, Matale District,
   * Central Province, Sri Lanka
   *
   * Backend uses these for accurate
   * route calculations.
   */
  pickupLocation?: string;
  dropoffLocation?: string;

  flightNumber?: string;

  specialRequests?: string;

  /*
   * Airport Transfer:
   * []
   *
   * Day Tour:
   * [mainDestination]
   *
   * Round Tour:
   * [night1, night2, night3, ...]
   */
  destinations?: string[];

  customer?: BookingCustomer;

  /*
   * Calculated by backend.
   */
  actualKilometres?: number;

  routeDurationMinutes?: number;

  /*
   * Calculated by backend.
   */
  totalAmount?: number;

  currency?: string;

  /*
   * Added after /api/bookings
   * creates the booking.
   */
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

    const parsed: unknown = JSON.parse(stored);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as BookingDraft : {};
  } catch (error) {
    console.error(
      "Unable to read booking draft:",
      error
    );

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

  try {
    const current =
      getBookingDraft();

    const itineraryKeys: (keyof BookingDraft)[] = ["serviceType", "vehicleTypeId", "travelDate", "returnDate", "passengerCount", "luggageCount", "numberOfNights", "pickupLocation", "dropoffLocation", "destinations", "customer", "flightNumber", "specialRequests"];
    const changed = itineraryKeys.some(key => key in updates && JSON.stringify(current[key]) !== JSON.stringify(updates[key]));
    const updated: BookingDraft = {
      ...current,
      ...updates,
      ...(changed ? { bookingId: undefined, bookingReference: undefined, requestId: undefined, confirmationToken: undefined, emailSent: undefined, status: undefined, paymentStatus: undefined, totalAmount: undefined, currency: undefined } : {}),
    };

    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  } catch (error) {
    console.error(
      "Unable to save booking draft:",
      error
    );
  }
}

export function clearBookingDraft() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.sessionStorage.removeItem(
      STORAGE_KEY
    );
  } catch (error) {
    console.error(
      "Unable to clear booking draft:",
      error
    );
  }
}