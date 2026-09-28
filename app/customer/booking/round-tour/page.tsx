"use client";

import { earliestBookingDate } from "@/src/client/bookingDates";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import ServiceColorDashes from "@/components/bookings/ServiceColorDashes";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

import {
  getBookingDraft,
  saveBookingDraft,
} from "@/src/client/bookingDraft";

/* =========================================================
   TYPES
========================================================= */

type Vehicle = {
  id: number;
  name: string;
  description: string | null;
  passengerCapacity: number;
  luggageCapacity: number;
  transmission: string | null;
  fuelType: string | null;
  airConditioning: boolean;
  chauffeurIncluded: boolean;
  chauffeurLanguage: string | null;
  imageUrl: string | null;
  status: string;
};

type PhotonFeature = {
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    countrycode?: string;
    type?: string;
  };
};

type PhotonResponse = {
  features?: PhotonFeature[];
};

type LocationAutocompleteProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

/* =========================================================
   PHOTON LOCATION HELPERS
========================================================= */

function buildLocationLabel(
  feature: PhotonFeature
) {
  const properties =
    feature.properties ?? {};

  const streetAddress = [
    properties.housenumber,
    properties.street,
  ]
    .filter(Boolean)
    .join(" ");

  const primary =
    properties.name ||
    streetAddress ||
    properties.city ||
    properties.district ||
    properties.county ||
    "";

  const possibleParts = [
    primary,

    properties.street !== primary
      ? properties.street
      : undefined,

    properties.district,
    properties.city,
    properties.county,
    properties.state,
    properties.country,
  ];

  const uniqueParts: string[] =
    [];

  possibleParts.forEach(
    (part) => {
      if (!part) {
        return;
      }

      const alreadyExists =
        uniqueParts.some(
          (existingPart) =>
            existingPart.toLowerCase() ===
            part.toLowerCase()
        );

      if (!alreadyExists) {
        uniqueParts.push(part);
      }
    }
  );

  return uniqueParts.join(", ");
}

/* =========================================================
   LOCATION ICON
========================================================= */

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="var(--green-primary)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute left-4 top-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />

      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}

/* =========================================================
   PHOTON LOCATION AUTOCOMPLETE
========================================================= */

function LocationAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
}: LocationAutocompleteProps) {
  const [
    suggestions,
    setSuggestions,
  ] = useState<PhotonFeature[]>(
    []
  );

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    const query =
      value.trim();

    if (
      !isOpen ||
      query.length < 2
    ) {
      setSuggestions([]);
      setLoading(false);

      return;
    }

    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);

            const params =
              new URLSearchParams({
                q: query,
                limit: "6",
                lang: "en",

                // Sri Lanka only
                countrycode: "LK",

                // Sri Lanka centre bias
                lat: "7.8731",
                lon: "80.7718",
                zoom: "7",

                location_bias_scale:
                  "0.1",
              });

            const response =
              await fetch(
                `https://photon.komoot.io/api/?${params.toString()}`,
                {
                  method: "GET",
                  signal:
                    controller.signal,
                }
              );

            if (!response.ok) {
              throw new Error(
                "Unable to load location suggestions."
              );
            }

            const data =
              (await response.json()) as PhotonResponse;

            const features =
              Array.isArray(
                data.features
              )
                ? data.features
                : [];

            setSuggestions(
              features.filter(
                (feature) =>
                  buildLocationLabel(
                    feature
                  ).trim() !== ""
              )
            );
          } catch (error) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              "Photon location search error:",
              error
            );

            setSuggestions([]);
          } finally {
            if (
              !controller.signal
                .aborted
            ) {
              setLoading(false);
            }
          }
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeout
      );

      controller.abort();
    };
  }, [value, isOpen]);

  function selectLocation(
    feature: PhotonFeature
  ) {
    const location =
      buildLocationLabel(feature);

    if (!location) {
      return;
    }

    onChange(location);

    setSuggestions([]);

    setIsOpen(false);
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
      >
        {label}
      </label>

      <div className="relative">
        <LocationIcon />

        <Input
          id={id}
          className="pl-11"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onFocus={() =>
            setIsOpen(true)
          }
          onBlur={() => {
            window.setTimeout(
              () =>
                setIsOpen(false),
              150
            );
          }}
          onChange={(event) => {
            onChange(
              event.target.value
            );

            setIsOpen(true);
          }}
        />

        {isOpen &&
          value.trim().length >=
            2 && (
            <div
              className="
                absolute
                left-0
                right-0
                top-[calc(100%+6px)]
                z-30
                max-h-[280px]
                overflow-y-auto
                rounded-xl
                border
                border-[var(--border-light)]
                bg-white
                shadow-[0_15px_40px_rgba(0,0,0,0.12)]
              "
            >
              {loading ? (
                <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                  Searching
                  locations...
                </div>
              ) : suggestions.length >
                0 ? (
                suggestions.map(
                  (
                    feature,
                    index
                  ) => {
                    const location =
                      buildLocationLabel(
                        feature
                      );

                    return (
                      <button
                        key={`${location}-${index}`}
                        type="button"
                        onMouseDown={(
                          event
                        ) => {
                          event.preventDefault();

                          selectLocation(
                            feature
                          );
                        }}
                        className="
                          block
                          w-full
                          border-b
                          border-[var(--border-light)]
                          px-4
                          py-3
                          text-left
                          transition
                          last:border-b-0
                          hover:bg-[var(--green-primary)]/5
                        "
                      >
                        <span className="block text-[13px] font-medium text-[var(--text-primary)]">
                          {location}
                        </span>
                      </button>
                    );
                  }
                )
              ) : (
                <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                  No Sri Lankan
                  locations found.
                </div>
              )}

              <div className="border-t border-[var(--border-light)] px-4 py-2 text-right text-[10px] text-gray-400">
                Location data ©
                OpenStreetMap
                contributors · Search
                by Photon
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

/* =========================================================
   RETURN DATE
========================================================= */

function calculateReturnDate(
  startDate: string,
  numberOfNights: number
) {
  const date =
    new Date(
      `${startDate}T00:00:00Z`
    );

  date.setUTCDate(
    date.getUTCDate() +
      numberOfNights
  );

  return date
    .toISOString()
    .slice(0, 10);
}

/* =========================================================
   ROUND TOUR PAGE
========================================================= */

export default function RoundTourPage() {
  const router =
    useRouter();

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    passengers,
    setPassengers,
  ] = useState(1);

  const [
    vehicleSearch,
    setVehicleSearch,
  ] = useState("");

  const [
    selectedVehicleId,
    setSelectedVehicleId,
  ] = useState<number | null>(
    null
  );

  const [
    vehicleDropdownOpen,
    setVehicleDropdownOpen,
  ] = useState(false);

  const [
    luggage,
    setLuggage,
  ] = useState("0");

  const [
    specialNotes,
    setSpecialNotes,
  ] = useState("");

  const [
    destinations,
    setDestinations,
  ] = useState<string[]>([
    "",
    "",
    "",
  ]);

  const [
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);

  const [
    loadingVehicles,
    setLoadingVehicles,
  ] = useState(true);

  const [
    vehicleError,
    setVehicleError,
  ] = useState("");

  const [
    pickupLocation,
    setPickupLocation,
  ] = useState("");

  const [
    dropoffLocation,
    setDropoffLocation,
  ] = useState("");

  /* =======================================================
     LOAD SAVED ROUND TOUR DATA
  ======================================================= */

  useEffect(() => {
    const draft =
      getBookingDraft();

    if (
      draft.serviceType !==
      "ROUND_TOUR"
    ) {
      return;
    }

    if (draft.travelDate) {
      setStartDate(
        draft.travelDate
      );
    }

    if (
      draft.passengerCount
    ) {
      setPassengers(
        draft.passengerCount
      );
    }

    if (
      draft.vehicleTypeId
    ) {
      setSelectedVehicleId(
        draft.vehicleTypeId
      );
    }

    if (
      draft.vehicleName
    ) {
      setVehicleSearch(
        draft.vehicleName
      );
    }

    if (
      draft.luggageCount !==
      undefined
    ) {
      setLuggage(
        String(
          draft.luggageCount
        )
      );
    }

    if (
      draft.pickupLocation
    ) {
      setPickupLocation(
        draft.pickupLocation
      );
    }

    if (
      draft.dropoffLocation
    ) {
      setDropoffLocation(
        draft.dropoffLocation
      );
    }

    if (
      draft.specialRequests
    ) {
      setSpecialNotes(
        draft.specialRequests
      );
    }

    if (
      draft.destinations &&
      draft.destinations
        .length > 0
    ) {
      const saved = [
        ...draft.destinations,
      ];

      while (
        saved.length < 3
      ) {
        saved.push("");
      }

      setDestinations(
        saved
      );
    }
  }, []);

  /* =======================================================
     LOAD VEHICLES FROM DATABASE
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadVehicles() {
      try {
        setLoadingVehicles(
          true
        );

        setVehicleError("");

        const response =
          await fetch(
            "/api/vehicles",
            {
              method: "GET",
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setVehicleError(
            data.error ||
              "Unable to load vehicles."
          );

          return;
        }

        const loadedVehicles:
          Vehicle[] =
          Array.isArray(
            data.vehicles
          )
            ? data.vehicles
            : [];

        setVehicles(
          loadedVehicles
        );

        const draft =
          getBookingDraft();

        if (
          draft.serviceType ===
            "ROUND_TOUR" &&
          draft.vehicleTypeId
        ) {
          const savedVehicle =
            loadedVehicles.find(
              (vehicle) =>
                vehicle.id ===
                draft.vehicleTypeId
            );

          if (savedVehicle) {
            setSelectedVehicleId(
              savedVehicle.id
            );

            setVehicleSearch(
              savedVehicle.name
            );
          }
        }
      } catch (error) {
        console.error(
          "Load vehicles error:",
          error
        );

        if (!cancelled) {
          setVehicleError(
            "Unable to load vehicles."
          );

          setVehicles([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingVehicles(
            false
          );
        }
      }
    }

    void loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     VEHICLE SEARCH
  ======================================================= */

  const filteredVehicles =
    useMemo(() => {
      const search =
        vehicleSearch
          .toLowerCase()
          .trim();

      if (!search) {
        return vehicles;
      }

      return vehicles.filter(
        (vehicle) => {
          return (
            vehicle.name
              .toLowerCase()
              .includes(
                search
              ) ||
            (
              vehicle.description ??
              ""
            )
              .toLowerCase()
              .includes(
                search
              ) ||
            (
              vehicle.transmission ??
              ""
            )
              .toLowerCase()
              .includes(
                search
              ) ||
            (
              vehicle.fuelType ??
              ""
            )
              .toLowerCase()
              .includes(
                search
              )
          );
        }
      );
    }, [
      vehicleSearch,
      vehicles,
    ]);

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.id ===
        selectedVehicleId
    ) ?? null;

  const vehicleDropdownItems =
    selectedVehicle &&
    vehicleSearch ===
      selectedVehicle.name
      ? vehicles
      : filteredVehicles;

  /* =======================================================
     PASSENGER CONTROLS
  ======================================================= */

  const increasePassengers =
    () => {
      setPassengers(
        (current) =>
          current + 1
      );
    };

  const decreasePassengers =
    () => {
      setPassengers(
        (current) =>
          Math.max(
            1,
            current - 1
          )
      );
    };

  const handlePassengerInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value;

    if (value === "") {
      setPassengers(1);

      return;
    }

    const number =
      Number(value);

    if (
      !Number.isNaN(
        number
      )
    ) {
      setPassengers(
        Math.max(
          1,
          Math.floor(
            number
          )
        )
      );
    }
  };

  /* =======================================================
     LUGGAGE CONTROLS
  ======================================================= */

  const increaseLuggage =
    () => {
      setLuggage(
        (current) =>
          String(
            (Number(
              current
            ) || 0) + 1
          )
      );
    };

  const decreaseLuggage =
    () => {
      setLuggage(
        (current) =>
          String(
            Math.max(
              0,
              (Number(
                current
              ) || 0) - 1
            )
          )
      );
    };

  const handleLuggageInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value;

    if (value === "") {
      setLuggage("");

      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    setLuggage(
      String(
        Math.max(
          0,
          Math.floor(
            Number(value)
          )
        )
      )
    );
  };

  /* =======================================================
     NIGHT DESTINATIONS
  ======================================================= */

  function updateDestination(
    index: number,
    value: string
  ) {
    setDestinations(
      (current) =>
        current.map(
          (
            destination,
            destinationIndex
          ) =>
            destinationIndex ===
            index
              ? value
              : destination
        )
    );
  }

  function addNight() {
    setDestinations(
      (current) => [
        ...current,
        "",
      ]
    );
  }

  function removeNight(
    index: number
  ) {
    if (
      destinations.length <= 3
    ) {
      return;
    }

    setDestinations(
      (current) =>
        current.filter(
          (
            _destination,
            destinationIndex
          ) =>
            destinationIndex !==
            index
        )
    );
  }

  /* =======================================================
     CONTINUE
  ======================================================= */

  function handleContinue() {
    if (startDate && startDate < earliestBookingDate()) {
      window.alert("Bookings must be made at least two calendar days ahead.");
      return;
    }

    if (!startDate) {
      window.alert(
        "Please select the tour start date."
      );

      return;
    }

    if (!selectedVehicle) {
      window.alert(
        "Please select a vehicle."
      );

      return;
    }

    if (
      !pickupLocation.trim()
    ) {
      window.alert(
        "Please enter the pickup location."
      );

      return;
    }

    const cleanedDestinations =
      destinations.map(
        (destination) =>
          destination.trim()
      );

    const hasEmptyDestination =
      cleanedDestinations.some(
        (destination) =>
          !destination
      );

    if (
      hasEmptyDestination
    ) {
      window.alert(
        "Please enter a destination for every night."
      );

      return;
    }

    if (
      !dropoffLocation.trim()
    ) {
      window.alert(
        "Please enter the final drop location."
      );

      return;
    }

    if (luggage === "") {
      window.alert(
        "Please enter the luggage count."
      );

      return;
    }

    const luggageCount =
      Number(luggage);

    if (
      passengers >
      selectedVehicle.passengerCapacity
    ) {
      window.alert(
        `${selectedVehicle.name} allows a maximum of ${selectedVehicle.passengerCapacity} passengers.`
      );

      return;
    }

    if (
      luggageCount >
      selectedVehicle.luggageCapacity
    ) {
      window.alert(
        `${selectedVehicle.name} allows a maximum of ${selectedVehicle.luggageCapacity} luggage items.`
      );

      return;
    }

    const numberOfNights =
      cleanedDestinations.length;

    const returnDate =
      calculateReturnDate(
        startDate,
        numberOfNights
      );

    saveBookingDraft({
      serviceType:
        "ROUND_TOUR",

      vehicleTypeId:
        selectedVehicle.id,

      vehicleName:
        selectedVehicle.name,

      travelDate:
        startDate,

      returnDate,

      passengerCount:
        passengers,

      luggageCount,

      numberOfNights,

      pickupLocation:
        pickupLocation.trim(),

      dropoffLocation:
        dropoffLocation.trim(),

      flightNumber:
        undefined,

      specialRequests:
        specialNotes.trim(),

      destinations:
        cleanedDestinations,

      bookingId:
        undefined,

      bookingReference:
        undefined,

      actualKilometres:
        undefined,

      routeDurationMinutes:
        undefined,

      totalAmount:
        undefined,

      currency:
        undefined,
    });

    router.push(
      "/customer/booking/customer-details"
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <BookingPageShell>
      {/* ===================================================
          SERVICE / PAGE INTRO
      =================================================== */}

      <section className="relative overflow-hidden bg-[#F4F7F1]">
        <DecorativePattern position="top-right" />

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1280px]
            px-6
            pb-12
            pt-10
            md:px-10
            md:pb-14
            md:pt-12
          "
        >
          <div>
            <ServiceTabs active="round-tour" />
          </div>

          <div className="mx-auto mt-12 max-w-[760px] text-center">
            <span
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--green-primary)]
              "
            >
              Round Tours
            </span>

            <h1
              className="
                mt-2
                font-serif
                text-[36px]
                font-semibold
                leading-tight
                text-[var(--green-dark)]
                md:text-[40px]
              "
            >
              Journey Across Sri Lanka
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-[620px]
                text-center
                text-[15px]
                leading-6
                text-gray-500
              "
            >
              Plan a memorable journey
              across Sri Lanka with a
              private vehicle,
              experienced chauffeur,
              and flexible overnight
              stays along your route.
            </p>

            <ServiceColorDashes active="round-tour" />
          </div>
        </div>
      </section>

      {/* ===================================================
          BOOKING STEP HEADER
      =================================================== */}

      <section className="bg-white">
        <div className="border-b border-[var(--border-light)]">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-6 md:px-10">
            <BookingStepHeader
              title="Your Travel Details — For Round Tours"
              step={1}
              totalSteps={4}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          FORM AREA
      =================================================== */}

      <section className="relative overflow-hidden bg-[#F8F7F1] py-10">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="space-y-8">

            {/* VEHICLE ERROR */}

            {vehicleError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
                {vehicleError}
              </div>
            )}

            {/* =============================================
                DATE + PASSENGERS
            ============================================= */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* START DATE */}

              <div>
                <label
                  htmlFor="start-date"
                  className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
                >
                  Start Date
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(
                    event
                  ) =>
                    setStartDate(
                      event.target
                        .value
                    )
                  }
                  min={earliestBookingDate()}
                  className="
                    h-[48px]
                    w-full
                    rounded-md
                    border
                    border-[var(--border-light)]
                    bg-white
                    px-4
                    text-[14px]
                    text-[var(--text-primary)]
                    outline-none
                    transition
                    focus:border-[var(--green-primary)]
                    focus:ring-1
                    focus:ring-[var(--green-primary)]
                  "
                />
              </div>

              {/* PASSENGERS */}

              <div>
                <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                  Number of Passengers
                </label>

                <div className="flex h-[48px] w-full items-center rounded-md border border-[var(--border-light)] bg-white">
                  <button
                    type="button"
                    onClick={
                      decreasePassengers
                    }
                    disabled={
                      passengers <= 1
                    }
                    className="
                      flex
                      h-full
                      w-14
                      items-center
                      justify-center
                      text-[22px]
                      font-medium
                      text-[var(--text-primary)]
                      transition
                      hover:bg-[var(--green-primary)]/5
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                    aria-label="Decrease passengers"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={
                      passengers
                    }
                    onChange={
                      handlePassengerInput
                    }
                    className="
                      h-full
                      flex-1
                      border-x
                      border-[var(--border-light)]
                      bg-transparent
                      text-center
                      text-[15px]
                      font-semibold
                      text-[var(--text-primary)]
                      outline-none
                    "
                    aria-label="Number of passengers"
                  />

                  <button
                    type="button"
                    onClick={
                      increasePassengers
                    }
                    className="
                      flex
                      h-full
                      w-14
                      items-center
                      justify-center
                      text-[22px]
                      font-medium
                      text-[var(--text-primary)]
                      transition
                      hover:bg-[var(--green-primary)]/5
                    "
                    aria-label="Increase passengers"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* =============================================
                VEHICLE SELECTION
            ============================================= */}

            <div>
              <label
                htmlFor="vehicle-search"
                className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
              >
                Selected Vehicle Preference
              </label>

              {loadingVehicles ? (
                <div className="rounded-md border border-[var(--border-light)] bg-white px-4 py-4 text-[13px] text-[var(--text-secondary)]">
                  Loading available
                  vehicles...
                </div>
              ) : (
                <div className="relative">
                  <Input
                    id="vehicle-search"
                    placeholder="Search vehicle or fleet class..."
                    value={
                      vehicleSearch
                    }
                    autoComplete="off"
                    onFocus={() =>
                      setVehicleDropdownOpen(
                        true
                      )
                    }
                    onBlur={() => {
                      window.setTimeout(
                        () =>
                          setVehicleDropdownOpen(
                            false
                          ),
                        150
                      );
                    }}
                    onChange={(
                      event
                    ) => {
                      setVehicleSearch(
                        event.target
                          .value
                      );

                      setSelectedVehicleId(
                        null
                      );

                      setVehicleDropdownOpen(
                        true
                      );
                    }}
                  />

                  {/* VEHICLE DROPDOWN */}

                  {vehicleDropdownOpen && (
                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+6px)]
                        z-20
                        max-h-[340px]
                        overflow-y-auto
                        overflow-x-hidden
                        rounded-xl
                        border
                        border-[var(--border-light)]
                        bg-white
                        shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                      "
                    >
                      {vehicleDropdownItems.length >
                      0 ? (
                        vehicleDropdownItems.map(
                          (
                            vehicle
                          ) => {
                            const category =
                              [
                                vehicle.transmission,
                                vehicle.fuelType,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " • "
                                ) ||
                              vehicle.description ||
                              "Available Vehicle";

                            return (
                              <button
                                key={
                                  vehicle.id
                                }
                                type="button"
                                onMouseDown={(
                                  event
                                ) => {
                                  event.preventDefault();

                                  setSelectedVehicleId(
                                    vehicle.id
                                  );

                                  setVehicleSearch(
                                    vehicle.name
                                  );

                                  setVehicleDropdownOpen(
                                    false
                                  );
                                }}
                                className="
                                  block
                                  w-full
                                  border-b
                                  border-[var(--border-light)]
                                  px-4
                                  py-3.5
                                  text-left
                                  transition
                                  last:border-b-0
                                  hover:bg-[var(--green-primary)]/5
                                "
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                                      {
                                        vehicle.name
                                      }
                                    </p>

                                    <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                                      {
                                        category
                                      }
                                    </p>
                                  </div>

                                  <div className="flex shrink-0 flex-wrap items-center gap-2">

                                    {/* PASSENGERS */}

                                    <div
                                      className="
                                        flex
                                        items-center
                                        gap-1.5
                                        rounded-md
                                        bg-[var(--green-primary)]/10
                                        px-2.5
                                        py-1.5
                                        text-[11px]
                                        font-semibold
                                        text-[var(--green-primary)]
                                      "
                                    >
                                      <svg
                                        viewBox="0 0 24 24"
                                        width="14"
                                        height="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <circle
                                          cx="12"
                                          cy="8"
                                          r="3"
                                        />

                                        <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                                      </svg>

                                      <span>
                                        {
                                          vehicle.passengerCapacity
                                        }{" "}
                                        Passengers
                                      </span>
                                    </div>

                                    {/* LUGGAGE */}

                                    <div
                                      className="
                                        flex
                                        items-center
                                        gap-1.5
                                        rounded-md
                                        bg-[#F6E9B6]
                                        px-2.5
                                        py-1.5
                                        text-[11px]
                                        font-semibold
                                        text-[var(--text-primary)]
                                      "
                                    >
                                      <svg
                                        viewBox="0 0 24 24"
                                        width="14"
                                        height="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
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
                                        {
                                          vehicle.luggageCapacity
                                        }{" "}
                                        Luggage
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          }
                        )
                      ) : (
                        <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                          No vehicles
                          found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SELECTED VEHICLE */}

              {selectedVehicle && (
                <div className="mt-3 rounded-lg border border-[var(--border-light)] bg-white px-4 py-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] font-medium text-[var(--text-secondary)]">
                        Vehicle selected
                      </p>

                      <p className="mt-0.5 text-[13px] font-semibold text-[var(--text-primary)]">
                        {
                          selectedVehicle.name
                        }
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
                        >
                          <circle
                            cx="12"
                            cy="8"
                            r="3"
                          />

                          <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                        </svg>

                        <span>
                          Max{" "}
                          {
                            selectedVehicle.passengerCapacity
                          }{" "}
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
                          {
                            selectedVehicle.luggageCapacity
                          }{" "}
                          luggage
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =============================================
                PICKUP LOCATION - PHOTON
            ============================================= */}

            <LocationAutocomplete
              id="round-tour-pickup"
              label="Pickup Location"
              placeholder="Start typing your hotel or pickup location"
              value={
                pickupLocation
              }
              onChange={
                setPickupLocation
              }
            />

            {/* =============================================
                NIGHT DESTINATIONS - PHOTON
            ============================================= */}

            <div>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[var(--green-primary)]" />

                  <h2 className="text-[18px] font-bold text-[var(--green-dark)]">
                    Night Destinations
                  </h2>
                </div>

                <div
                  className="
                    mt-3
                    flex
                    items-start
                    gap-2
                    rounded-xl
                    border
                    border-[var(--yellow-golden)]/30
                    bg-[var(--yellow-warm)]/10
                    px-4
                    py-3
                    text-[12px]
                    font-medium
                    text-[var(--text-primary)]
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="var(--gold-mustard)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-[1px] shrink-0"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />

                    <path d="M12 8v5" />

                    <path d="M12 16h.01" />
                  </svg>

                  <p>
                    Three nights are
                    shown initially.
                    Add another night
                    only if your tour
                    requires it.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {destinations.map(
                  (
                    destination,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="rounded-xl border border-[var(--border-light)] bg-white p-4"
                    >
                      <div className="flex items-end gap-3">
                        <div className="min-w-0 flex-1">
                          <LocationAutocomplete
                            id={`night-destination-${index}`}
                            label={`Night ${
                              index + 1
                            } Destination`}
                            placeholder={`Start typing the destination for night ${
                              index + 1
                            }`}
                            value={
                              destination
                            }
                            onChange={(
                              value
                            ) =>
                              updateDestination(
                                index,
                                value
                              )
                            }
                          />
                        </div>

                        {destinations.length >
                          3 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeNight(
                                index
                              )
                            }
                            className="
                              mb-[1px]
                              flex
                              h-[48px]
                              w-[48px]
                              shrink-0
                              items-center
                              justify-center
                              rounded-md
                              border
                              border-red-200
                              bg-white
                              text-red-500
                              transition
                              hover:bg-red-50
                            "
                            aria-label={`Remove night ${
                              index + 1
                            }`}
                            title="Remove night"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />

                              <path d="M8 6V4h8v2" />

                              <path d="M19 6l-1 14H6L5 6" />

                              <path d="M10 11v5" />

                              <path d="M14 11v5" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={addNight}
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-[var(--green-primary)]
                  bg-white
                  px-4
                  py-2.5
                  text-[12px]
                  font-semibold
                  text-[var(--green-primary)]
                  transition
                  hover:bg-[var(--green-primary)]/5
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />

                  <path d="M5 12h14" />
                </svg>

                Add Another Night
              </button>
            </div>

            {/* =============================================
                FINAL DROP LOCATION - PHOTON
            ============================================= */}

            <LocationAutocomplete
              id="round-tour-dropoff"
              label="Final Drop Location"
              placeholder="Start typing your final hotel or drop location"
              value={
                dropoffLocation
              }
              onChange={
                setDropoffLocation
              }
            />

            {/* =============================================
                LUGGAGE
            ============================================= */}

            <div>
              <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                Luggage Requirements
              </label>

              <div className="flex h-[48px] w-full items-center rounded-md border border-[var(--border-light)] bg-white">
                <button
                  type="button"
                  onClick={
                    decreaseLuggage
                  }
                  disabled={
                    Number(
                      luggage
                    ) <= 0
                  }
                  className="
                    flex
                    h-full
                    w-14
                    items-center
                    justify-center
                    text-[22px]
                    font-medium
                    text-[var(--text-primary)]
                    transition
                    hover:bg-[var(--green-primary)]/5
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
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
                  onChange={
                    handleLuggageInput
                  }
                  className="
                    h-full
                    flex-1
                    border-x
                    border-[var(--border-light)]
                    bg-transparent
                    text-center
                    text-[15px]
                    font-semibold
                    text-[var(--text-primary)]
                    outline-none
                  "
                  aria-label="Number of luggage items"
                />

                <button
                  type="button"
                  onClick={
                    increaseLuggage
                  }
                  className="
                    flex
                    h-full
                    w-14
                    items-center
                    justify-center
                    text-[22px]
                    font-medium
                    text-[var(--text-primary)]
                    transition
                    hover:bg-[var(--green-primary)]/5
                  "
                  aria-label="Increase luggage"
                >
                  +
                </button>
              </div>
            </div>

            {/* =============================================
                SPECIAL NOTES
            ============================================= */}

            <Textarea
              label="Special Notes or Requirements"
              placeholder="Tell us about preferred destinations, activities, accessibility requirements, or anything else..."
              value={
                specialNotes
              }
              onChange={(
                event
              ) =>
                setSpecialNotes(
                  event.target
                    .value
                )
              }
            />

            {/* =============================================
                CONTINUE
            ============================================= */}

            <div className="flex justify-end pt-1">
              <Button
                onClick={
                  handleContinue
                }
                disabled={
                  loadingVehicles
                }
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