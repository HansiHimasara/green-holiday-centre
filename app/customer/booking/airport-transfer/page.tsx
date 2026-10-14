"use client";

import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  searchSriLankanAirports,
  validAirportTransfer,
} from "@/src/shared/airports";

import { apiFetch as fetch } from "@/src/client/apiFetch";
import { earliestBookingDate } from "@/src/client/bookingDates";

import {
  getBookingDraft,
  saveBookingDraft,
} from "@/src/client/bookingDraft";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import ServiceColorDashes from "@/components/bookings/ServiceColorDashes";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  passengerCapacity: number;
  luggageCapacity: number;
};

type PhotonFeature = {
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };

  geometry?: {
    coordinates?: [number, number];
  };
};

type PhotonResponse = {
  features?: PhotonFeature[];
};

type LocationSuggestion = {
  id: string;
  label: string;
};

type LocationAutocompleteProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

const PHOTON_API_URL = "https://photon.komoot.io/api/";

function formatPhotonAddress(feature: PhotonFeature): string {
  const properties = feature.properties ?? {};

  const name = properties.name?.trim();

  const street = [
    properties.housenumber,
    properties.street,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const area = [
    properties.city,
    properties.district,
    properties.state,
  ]
    .filter(Boolean)
    .filter(
      (value, index, array) => array.indexOf(value) === index,
    )
    .join(", ");

  const country = properties.country?.trim();

  return [name, street, area, country]
    .filter(Boolean)
    .filter(
      (value, index, array) => array.indexOf(value) === index,
    )
    .join(", ");
}

function LocationAutocomplete({
  label,
  value,
  placeholder,
  onChange,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const selectedValueRef = useRef<string | null>(null);

  const searchLocations = async (query: string) => {
    const requestId = ++requestIdRef.current;

    const airportSuggestions: LocationSuggestion[] =
      searchSriLankanAirports(query).map((airport) => ({
        id: `airport-${airport}`,
        label: airport,
      }));

    if (query === selectedValueRef.current) {
      setOpen(false);
      setLoading(false);
      return;
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setOpen(true);
    setSuggestions(airportSuggestions);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        q: `${query.trim()}, Sri Lanka`,
        lang: "en",
        limit: "6",
        bbox: "79.5,5.8,81.9,9.9",
      });

      const response = await fetch(
        `${PHOTON_API_URL}?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Location search failed with status ${response.status}.`,
        );
      }

      const data = (await response.json()) as PhotonResponse;

      if (requestId !== requestIdRef.current) {
        return;
      }

      const nextSuggestions: LocationSuggestion[] = (
        data.features ?? []
      )
        .map((feature, index) => {
          const suggestionLabel = formatPhotonAddress(feature);
          const coordinates = feature.geometry?.coordinates;

          const coordinateKey = coordinates
            ? `${coordinates[0]}-${coordinates[1]}`
            : `${index}`;

          if (!suggestionLabel) {
            return null;
          }

          return {
            id: `${suggestionLabel}-${coordinateKey}`,
            label: suggestionLabel,
          };
        })
        .filter(
          (suggestion): suggestion is LocationSuggestion =>
            Boolean(suggestion),
        )
        .filter(
          (suggestion, index, array) =>
            array.findIndex(
              (item) => item.label === suggestion.label,
            ) === index,
        );

      setSuggestions([
        ...airportSuggestions,
        ...nextSuggestions.filter(
          (item) =>
            !airportSuggestions.some(
              (airport) => airport.label === item.label,
            ),
        ),
      ]);
    } catch (error) {
      console.error("Location autocomplete error:", error);

      if (requestId === requestIdRef.current) {
        setSuggestions(airportSuggestions);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void searchLocations(value);
    }, 300);

    return () => {
      window.clearTimeout(timer);
      requestIdRef.current += 1;
    };
  }, [value]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!containerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentClick,
      );
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
        {label}
      </label>

      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="var(--green-primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2"
          aria-hidden="true"
        >
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>

        <Input
          className="pl-11"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onFocus={() => {
            if (value.trim().length >= 2) {
              setOpen(true);
            }
          }}
          onChange={(event) => {
            selectedValueRef.current = null;
            requestIdRef.current += 1;
            onChange(event.target.value);
          }}
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[300px] overflow-y-auto overflow-x-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
          {loading ? (
            <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
              Searching locations...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    selectedValueRef.current = suggestion.label;
                    requestIdRef.current += 1;

                    onChange(suggestion.label);
                    setSuggestions([]);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-3 border-b border-[var(--border-light)] px-4 py-3 text-left transition last:border-b-0 hover:bg-[var(--green-primary)]/5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="var(--green-primary)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>

                  <span className="text-[13px] leading-5 text-[var(--text-primary)]">
                    {suggestion.label}
                  </span>
                </button>
              ))}

              <div className="px-4 py-2 text-right text-[10px] text-gray-400">
                Location data © OpenStreetMap contributors ·
                Search by Photon
              </div>
            </>
          ) : (
            <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
              No matching locations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AirportTransferPage() {
  const router = useRouter();

  const [locationError, setLocationError] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const [vehicleDropdownOpen, setVehicleDropdownOpen] =
    useState(false);

  const [luggage, setLuggage] = useState(0);
  const [specialRequirements, setSpecialRequirements] =
    useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehicleError, setVehicleError] = useState("");

  // Restore existing booking details.
  useEffect(() => {
    const requestedVehicle = new URLSearchParams(
      window.location.search,
    ).get("vehicle");

    if (requestedVehicle && /^\d+$/.test(requestedVehicle)) {
      const vehicleTypeId = Number(requestedVehicle);

      saveBookingDraft({ vehicleTypeId });

      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize browser-only draft/URL state after hydration.
      setSelectedVehicle(requestedVehicle);
    }

    const draft = getBookingDraft();

    if (draft.serviceType !== "AIRPORT_TRANSFER") {
      return;
    }

    if (draft.travelDate) {
      setTravelDate(draft.travelDate);
    }

    if (draft.passengerCount) {
      setPassengers(draft.passengerCount);
    }

    if (draft.pickupLocation) {
      setPickupLocation(draft.pickupLocation);
    }

    if (draft.dropoffLocation) {
      setDropLocation(draft.dropoffLocation);
    }

    if (draft.vehicleTypeId) {
      setSelectedVehicle(String(draft.vehicleTypeId));
    }

    if (draft.vehicleName) {
      setVehicleSearch(draft.vehicleName);
    }

    if (draft.luggageCount !== undefined) {
      setLuggage(Math.max(0, draft.luggageCount));
    }

    if (draft.specialRequests) {
      setSpecialRequirements(draft.specialRequests);
    }
  }, []);

  // Load available vehicles from the database.
  useEffect(() => {
    let cancelled = false;

    const loadVehicles = async () => {
      try {
        setLoadingVehicles(true);
        setVehicleError("");

        const response = await fetch("/api/vehicles", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load vehicles.",
          );
        }

        const loadedVehicles: Vehicle[] = Array.isArray(
          data.vehicles,
        )
          ? data.vehicles.map(
              (vehicle: {
                id: number;
                name: string;
                description?: string | null;
                transmission?: string | null;
                fuelType?: string | null;
                passengerCapacity: number;
                luggageCapacity: number;
              }) => ({
                id: String(vehicle.id),
                name: vehicle.name,
                category:
                  [
                    vehicle.transmission,
                    vehicle.fuelType,
                  ]
                    .filter(Boolean)
                    .join(" • ") ||
                  vehicle.description ||
                  "Available Vehicle",
                passengerCapacity: vehicle.passengerCapacity,
                luggageCapacity: vehicle.luggageCapacity,
              }),
            )
          : [];

        if (!cancelled) {
          setVehicles(loadedVehicles);

          const draft = getBookingDraft();

          if (
            draft.serviceType === "AIRPORT_TRANSFER" &&
            draft.vehicleTypeId
          ) {
            const savedVehicle = loadedVehicles.find(
              (vehicle) =>
                vehicle.id === String(draft.vehicleTypeId),
            );

            if (savedVehicle) {
              setSelectedVehicle(savedVehicle.id);
              setVehicleSearch(savedVehicle.name);
            }
          }
        }
      } catch (error) {
        console.error("Load vehicles error:", error);

        if (!cancelled) {
          setVehicles([]);
          setVehicleError("Unable to load vehicles.");
        }
      } finally {
        if (!cancelled) {
          setLoadingVehicles(false);
        }
      }
    };

    void loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedVehicleData = useMemo(
    () =>
      vehicles.find(
        (vehicle) => vehicle.id === selectedVehicle,
      ) ?? null,
    [vehicles, selectedVehicle],
  );

  const filteredVehicles = useMemo(() => {
    const search = vehicleSearch.toLowerCase().trim();

    if (!search) {
      return vehicles;
    }

    return vehicles.filter(
      (vehicle) =>
        vehicle.name.toLowerCase().includes(search) ||
        vehicle.category.toLowerCase().includes(search),
    );
  }, [vehicles, vehicleSearch]);

  const vehicleDropdownItems =
    selectedVehicleData &&
    vehicleSearch === selectedVehicleData.name
      ? vehicles
      : filteredVehicles;

  const increasePassengers = () => {
    setPassengers((current) => current + 1);
  };

  const decreasePassengers = () => {
    setPassengers((current) => Math.max(1, current - 1));
  };

  const handlePassengerInput = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    if (value === "") {
      setPassengers(1);
      return;
    }

    const number = Number(value);

    if (!Number.isNaN(number)) {
      setPassengers(Math.max(1, Math.floor(number)));
    }
  };

  const increaseLuggage = () => {
    setLuggage((current) => current + 1);
  };

  const decreaseLuggage = () => {
    setLuggage((current) => Math.max(0, current - 1));
  };

  const handleLuggageInput = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    if (value === "") {
      setLuggage(0);
      return;
    }

    const number = Number(value);

    if (!Number.isNaN(number)) {
      setLuggage(Math.max(0, Math.floor(number)));
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("#vehicle-search-wrapper")) {
        setVehicleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentClick,
      );
    };
  }, []);

  const handleContinue = () => {
    if (!pickupLocation.trim() || !dropLocation.trim()) {
      setLocationError(
        "Please enter both pickup and drop locations.",
      );
      return;
    }

    if (
      pickupLocation.trim().toLowerCase() ===
      dropLocation.trim().toLowerCase()
    ) {
      setLocationError(
        "Pickup and drop locations must be different.",
      );
      return;
    }

    if (!validAirportTransfer(pickupLocation, dropLocation)) {
      setLocationError(
        "Pickup or drop location must be a Sri Lankan airport. Type an airport name or code and select it from the suggestions.",
      );
      return;
    }

    setLocationError("");

    const vehicle = vehicles.find(
      (item) => item.id === selectedVehicle,
    );

    if (
      travelDate &&
      travelDate < earliestBookingDate()
    ) {
      window.alert(
        "Bookings must be made at least four calendar days ahead.",
      );
      return;
    }

    if (!travelDate) {
      window.alert("Please select your travel date.");
      return;
    }

    if (!pickupLocation.trim()) {
      window.alert("Please enter the pickup location.");
      return;
    }

    if (!dropLocation.trim()) {
      window.alert("Please enter the drop location.");
      return;
    }

    if (!vehicle) {
      window.alert("Please select a vehicle.");
      return;
    }

    if (passengers > vehicle.passengerCapacity) {
      window.alert(
        `${vehicle.name} allows a maximum of ${vehicle.passengerCapacity} passengers.`,
      );
      return;
    }

    if (luggage > vehicle.luggageCapacity) {
      window.alert(
        `${vehicle.name} allows a maximum of ${vehicle.luggageCapacity} luggage items.`,
      );
      return;
    }

    saveBookingDraft({
      serviceType: "AIRPORT_TRANSFER",
      vehicleTypeId: Number(vehicle.id),
      vehicleName: vehicle.name,
      travelDate,
      returnDate: undefined,
      passengerCount: passengers,
      luggageCount: luggage,
      numberOfNights: undefined,
      pickupLocation: pickupLocation.trim(),
      dropoffLocation: dropLocation.trim(),
      flightNumber: undefined,
      specialRequests: specialRequirements.trim(),
      destinations: [],

      // Clear previously calculated booking values.
      actualKilometres: undefined,
      routeDurationMinutes: undefined,
      totalAmount: undefined,
      currency: undefined,
      bookingId: undefined,
      bookingReference: undefined,
    });

    router.push("/customer/booking/customer-details");
  };

  return (
    <BookingPageShell>
      <section className="relative overflow-hidden bg-[#F4F7F1]">
        <DecorativePattern position="top-right" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-12 pt-10 md:px-10 md:pb-14 md:pt-12">
          <div>
            <ServiceTabs active="airport-transfer" />
          </div>

          <div className="mx-auto mt-12 max-w-[760px] text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-primary)]">
              Airport Transfers
            </span>

            <h1 className="mt-2 font-serif text-[36px] font-semibold leading-tight text-[var(--green-dark)] md:text-[40px]">
              Start Your Journey Smoothly
            </h1>

            <p className="mx-auto mt-4 max-w-[620px] text-center text-[15px] leading-6 text-gray-500">
              Enjoy a comfortable and reliable airport transfer
              with a professional chauffeur, whether you are
              arriving in or departing from Sri Lanka.
            </p>

            <ServiceColorDashes active="airport-transfer" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="border-b border-[var(--border-light)]">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-6 md:px-10">
            <BookingStepHeader
              title="Your Travel Details — For Airport Transfers"
              step={1}
              totalSteps={4}
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#F8F7F1] py-10">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="flex items-start gap-3 rounded-xl border border-[var(--yellow-golden)]/30 bg-[var(--yellow-warm)]/10 px-5 py-4 text-[12px] font-medium text-[var(--text-primary)]">
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="var(--gold-mustard)"
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
              Please note: Either your Pickup or Dropoff
              Location must originate from or terminate at
              the Airport for this booking service.
            </p>
          </div>

          <div className="mt-9 space-y-8">
            {vehicleError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
                {vehicleError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="travel-date"
                  className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
                >
                  Date of Travel
                </label>

                <input
                  id="travel-date"
                  type="date"
                  value={travelDate}
                  onChange={(event) =>
                    setTravelDate(event.target.value)
                  }
                  min={earliestBookingDate()}
                  className="h-[48px] w-full rounded-md border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--green-primary)] focus:ring-1 focus:ring-[var(--green-primary)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                  Number of Passengers
                </label>

                <div className="flex h-[48px] w-full items-center rounded-md border border-[var(--border-light)] bg-white">
                  <button
                    type="button"
                    onClick={decreasePassengers}
                    disabled={passengers <= 1}
                    className="flex h-full w-14 items-center justify-center text-[22px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--green-primary)]/5 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease passengers"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={passengers}
                    onChange={handlePassengerInput}
                    className="h-full flex-1 border-x border-[var(--border-light)] bg-transparent text-center text-[15px] font-semibold text-[var(--text-primary)] outline-none"
                    aria-label="Number of passengers"
                  />

                  <button
                    type="button"
                    onClick={increasePassengers}
                    className="flex h-full w-14 items-center justify-center text-[22px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--green-primary)]/5"
                    aria-label="Increase passengers"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <LocationAutocomplete
              label="Pickup Location"
              placeholder="Search for an airport, hotel, address, or place..."
              value={pickupLocation}
              onChange={(value) => {
                setPickupLocation(value);
                setLocationError("");
              }}
            />

            <LocationAutocomplete
              label="Drop Location"
              placeholder="Search for an airport, hotel, address, or place..."
              value={dropLocation}
              onChange={(value) => {
                setDropLocation(value);
                setLocationError("");
              }}
            />

            <p className="text-sm text-[var(--text-secondary)]">
              At least one location must be a Sri Lankan
              airport. Search by airport name or code (for
              example CMB), then select the airport suggestion.
            </p>

            {locationError && (
              <p
                role="alert"
                className="text-sm font-medium text-red-600"
              >
                {locationError}
              </p>
            )}

            <div>
              <label
                htmlFor="vehicle-search"
                className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
              >
                Selected Vehicle Preference
              </label>

              {loadingVehicles ? (
                <div className="rounded-md border border-[var(--border-light)] bg-white px-4 py-4 text-[13px] text-[var(--text-secondary)]">
                  Loading available vehicles...
                </div>
              ) : (
                <div
                  id="vehicle-search-wrapper"
                  className="relative"
                >
                  <Input
                    id="vehicle-search"
                    placeholder="Search vehicle or fleet class..."
                    value={vehicleSearch}
                    autoComplete="off"
                    onFocus={() =>
                      setVehicleDropdownOpen(true)
                    }
                    onChange={(event) => {
                      setVehicleSearch(event.target.value);
                      setSelectedVehicle("");
                      setVehicleDropdownOpen(true);
                    }}
                  />

                  {vehicleDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-[340px] overflow-y-auto overflow-x-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
                      {vehicleDropdownItems.length > 0 ? (
                        vehicleDropdownItems.map((vehicle) => (
                          <button
                            key={vehicle.id}
                            type="button"
                            onMouseDown={(event) => {
                              event.preventDefault();
                            }}
                            onClick={() => {
                              setSelectedVehicle(vehicle.id);
                              setVehicleSearch(vehicle.name);
                              setVehicleDropdownOpen(false);
                            }}
                            className="block w-full border-b border-[var(--border-light)] px-4 py-3.5 text-left transition last:border-b-0 hover:bg-[var(--green-primary)]/5"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                                  {vehicle.name}
                                </p>

                                <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                                  {vehicle.category}
                                </p>
                              </div>

                              <div className="flex shrink-0 flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 rounded-md bg-[var(--green-primary)]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--green-primary)]">
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <circle
                                      cx="12"
                                      cy="8"
                                      r="3"
                                    />
                                    <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                                  </svg>

                                  <span>
                                    {vehicle.passengerCapacity}{" "}
                                    Passengers
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 rounded-md bg-[#F6E9B6] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <rect
                                      x="5"
                                      y="7"
                                      width="14"
                                      height="13"
                                      rx="2"
                                    />
                                    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                                    <path d="M9 12v3" />
                                    <path d="M15 12v3" />
                                  </svg>

                                  <span>
                                    {vehicle.luggageCapacity}{" "}
                                    Luggage
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                          No vehicles found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedVehicleData && (
                <div className="mt-3 rounded-lg border border-[var(--border-light)] bg-white px-4 py-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] font-medium text-[var(--text-secondary)]">
                        Vehicle selected
                      </p>

                      <p className="mt-0.5 text-[13px] font-semibold text-[var(--text-primary)]">
                        {selectedVehicleData.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 rounded-md bg-[var(--green-primary)]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--green-primary)]">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="8" r="3" />
                          <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                        </svg>

                        <span>
                          Max{" "}
                          {selectedVehicleData.passengerCapacity}{" "}
                          passengers
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-md bg-[#F6E9B6] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect
                            x="5"
                            y="7"
                            width="14"
                            height="13"
                            rx="2"
                          />
                          <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                          <path d="M9 12v3" />
                          <path d="M15 12v3" />
                        </svg>

                        <span>
                          Max{" "}
                          {selectedVehicleData.luggageCapacity}{" "}
                          luggage
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                Luggage Requirements
              </label>

              <div className="flex h-[48px] w-full items-center rounded-md border border-[var(--border-light)] bg-white">
                <button
                  type="button"
                  onClick={decreaseLuggage}
                  disabled={luggage <= 0}
                  className="flex h-full w-14 items-center justify-center text-[22px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--green-primary)]/5 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease luggage"
                >
                  −
                </button>

                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={luggage}
                  onChange={handleLuggageInput}
                  className="h-full flex-1 border-x border-[var(--border-light)] bg-transparent text-center text-[15px] font-semibold text-[var(--text-primary)] outline-none"
                  aria-label="Number of luggage items"
                />

                <button
                  type="button"
                  onClick={increaseLuggage}
                  className="flex h-full w-14 items-center justify-center text-[22px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--green-primary)]/5"
                  aria-label="Increase luggage"
                >
                  +
                </button>
              </div>
            </div>

            <Textarea
              label="Special Requirements or Flight Information"
              placeholder="Enter flight number, required infant seats, extra surfboards, or transit instructions..."
              value={specialRequirements}
              onChange={(event) =>
                setSpecialRequirements(event.target.value)
              }
            />

            <div className="flex justify-end pt-1">
              <Button
                onClick={handleContinue}
                disabled={loadingVehicles}
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