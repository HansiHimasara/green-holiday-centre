"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import ServiceColorDashes from "@/components/bookings/ServiceColorDashes";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

import {
  getBookingDraft,
  saveBookingDraft,
} from "@/src/client/bookingDraft";

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

type PricingRoute = {
  id: number;
  fromLocation: string;
  toLocation: string;
  distance: number;
  baseCharge: number;
  extraKilometreCharge: number;
  currency: string;
};

export default function DayTourPage() {
  const router =
    useRouter();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [
    tourDate,
    setTourDate,
  ] = useState("");

  const [
    passengers,
    setPassengers,
  ] = useState(1);

  const [
    selectedPricingRoute,
    setSelectedPricingRoute,
  ] = useState("");

  const [
    pricingRoutes,
    setPricingRoutes,
  ] = useState<PricingRoute[]>([]);

  const [
    pricingRoutesLoading,
    setPricingRoutesLoading,
  ] = useState(true);

  const [
    pricingRouteError,
    setPricingRouteError,
  ] = useState("");

  const [
    vehicleSearch,
    setVehicleSearch,
  ] = useState("");

  const [
    selectedVehicleId,
    setSelectedVehicleId,
  ] =
    useState<number | null>(
      null
    );

  const [
    luggage,
    setLuggage,
  ] = useState("");

  const [
    meetingLocation,
    setMeetingLocation,
  ] = useState("");

  const [
    tourDestination,
    setTourDestination,
  ] = useState("");

  const [
    dropLocation,
    setDropLocation,
  ] = useState("");

  const [
    specialRequirements,
    setSpecialRequirements,
  ] = useState("");

  const [
    vehicles,
    setVehicles,
  ] =
    useState<Vehicle[]>([]);

  const [
    loadingVehicles,
    setLoadingVehicles,
  ] = useState(true);

  const [
    vehicleError,
    setVehicleError,
  ] = useState("");

  // ==========================================
  // LOAD SAVED DAY TOUR DRAFT
  // ==========================================

  useEffect(() => {
    const draft =
      getBookingDraft();

    if (
      draft.serviceType !==
      "DAY_TOUR"
    ) {
      return;
    }

    if (draft.travelDate) {
      setTourDate(
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

    if (draft.pricingId) {
      setSelectedPricingRoute(
        String(draft.pricingId)
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
      setMeetingLocation(
        draft.pickupLocation
      );
    }

    if (
      draft.dropoffLocation
    ) {
      setDropLocation(
        draft.dropoffLocation
      );
    }

    if (
      draft.destinations &&
      draft.destinations.length > 0
    ) {
      setTourDestination(
        draft.destinations[0]
      );
    }

    if (
      draft.specialRequests
    ) {
      setSpecialRequirements(
        draft.specialRequests
      );
    }
  }, []);

  // ==========================================
  // LOAD PRICING ROUTES FROM DATABASE
  // ==========================================

  useEffect(() => {
    let cancelled =
      false;

    async function loadPricingRoutes() {
      try {
        setPricingRoutesLoading(
          true
        );

        setPricingRouteError("");

        const response =
          await fetch(
            "/api/pricing-routes",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setPricingRouteError(
              data.error ||
                "Unable to load pricing routes."
            );
          }

          return;
        }

        const loadedRoutes: PricingRoute[] =
          Array.isArray(
            data.routes
          )
            ? data.routes
            : [];

        if (!cancelled) {
          setPricingRoutes(
            loadedRoutes
          );
        }
      } catch (error) {
        console.error(
          "Load pricing routes error:",
          error
        );

        if (!cancelled) {
          setPricingRouteError(
            "Unable to load pricing routes."
          );

          setPricingRoutes([]);
        }
      } finally {
        if (!cancelled) {
          setPricingRoutesLoading(
            false
          );
        }
      }
    }

    void loadPricingRoutes();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // LOAD VEHICLES FROM DATABASE
  // ==========================================

  useEffect(() => {
    let cancelled =
      false;

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
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setVehicleError(
              data.error ||
                "Unable to load vehicles."
            );
          }

          return;
        }

        const loadedVehicles: Vehicle[] =
          Array.isArray(
            data.vehicles
          )
            ? data.vehicles
            : [];

        if (!cancelled) {
          setVehicles(
            loadedVehicles
          );

          const draft =
            getBookingDraft();

          if (
            draft.serviceType ===
              "DAY_TOUR" &&
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

  // ==========================================
  // VEHICLE SEARCH
  // ==========================================

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
              .includes(search) ||
            (
              vehicle.description ??
              ""
            )
              .toLowerCase()
              .includes(search) ||
            (
              vehicle.transmission ??
              ""
            )
              .toLowerCase()
              .includes(search) ||
            (
              vehicle.fuelType ??
              ""
            )
              .toLowerCase()
              .includes(search)
          );
        }
      );
    }, [
      vehicles,
      vehicleSearch,
    ]);

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.id ===
        selectedVehicleId
    ) ?? null;

  // ==========================================
  // ROUTE SELECTION
  // ==========================================

  const handlePricingRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value;

    setSelectedPricingRoute(
      value
    );

    const route =
      pricingRoutes.find(
        (pricingRoute) =>
          String(pricingRoute.id) ===
          value
      );

    if (!route) {
      setMeetingLocation("");
      setTourDestination("");
      setDropLocation("");
      return;
    }

    setMeetingLocation(
      route.fromLocation
    );

    setTourDestination(
      route.toLocation
    );

    setDropLocation(
      route.fromLocation
    );
  };

  // ==========================================
  // PASSENGER CONTROLS
  // ==========================================

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
    event: React.ChangeEvent<HTMLInputElement>
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
      !Number.isNaN(number)
    ) {
      setPassengers(
        Math.max(
          1,
          Math.floor(number)
        )
      );
    }
  };

  // ==========================================
  // CONTINUE
  // ==========================================

  function handleContinue() {
    if (!tourDate) {
      window.alert(
        "Please select your tour date."
      );

      return;
    }

    if (!selectedPricingRoute) {
      window.alert(
        "Please select a day tour route."
      );

      return;
    }

    if (
      !meetingLocation.trim()
    ) {
      window.alert(
        "Please enter your meeting location."
      );

      return;
    }

    if (
      !tourDestination.trim()
    ) {
      window.alert(
        "Please enter the main tour destination."
      );

      return;
    }

    if (
      !dropLocation.trim()
    ) {
      window.alert(
        "Please enter the return or drop location."
      );

      return;
    }

    if (!selectedVehicle) {
      window.alert(
        "Please select a vehicle."
      );

      return;
    }

    if (luggage === "") {
      window.alert(
        "Please select the luggage count."
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

    saveBookingDraft({
      serviceType:
        "DAY_TOUR",

      pricingId:
        Number(selectedPricingRoute),

      vehicleTypeId:
        selectedVehicle.id,

      vehicleName:
        selectedVehicle.name,

      travelDate:
        tourDate,

      returnDate:
        undefined,

      passengerCount:
        passengers,

      luggageCount,

      numberOfNights:
        undefined,

      pickupLocation:
        meetingLocation.trim(),

      dropoffLocation:
        dropLocation.trim(),

      flightNumber:
        undefined,

      specialRequests:
        specialRequirements.trim(),

      destinations: [
        tourDestination.trim(),
      ],

      /*
       * New trip = remove old calculated
       * price and old booking reference.
       */
      actualKilometres:
        undefined,

      routeDurationMinutes:
        undefined,

      bookingId:
        undefined,

      bookingReference:
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

  return (
    <BookingPageShell>
      {/* ==========================================
          SERVICE / PAGE INTRO
      ========================================== */}
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
          {/* Service Tabs */}
          <div>
            <ServiceTabs active="day-tour" />
          </div>

          {/* Page Introduction */}
          <div className="mx-auto mt-12 max-w-[760px] text-center">
            {/* Eyebrow */}
            <span
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--green-primary)]
              "
            >
              Day Tours
            </span>

            {/* Heading */}
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
              Discover More in a Day
            </h1>

            {/* Description */}
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
              Explore the beauty, culture, and hidden gems of Sri Lanka with
              a comfortable private vehicle and an experienced chauffeur.
            </p>

            {/* Service Colour Indicator */}
            <ServiceColorDashes active="day-tour" />
          </div>
        </div>
      </section>

      {/* ==========================================
          BOOKING STEP HEADER
      ========================================== */}
      <section className="bg-white">
        <div className="border-b border-[var(--border-light)]">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-6 md:px-10">
            <BookingStepHeader
              title="Your Travel Details — For Day Tours"
              step={1}
              totalSteps={4}
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          FORM AREA
      ========================================== */}
      <section className="relative overflow-hidden bg-[#F8F7F1] py-10">

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="mt-1 space-y-8">

            {vehicleError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
                {vehicleError}
              </div>
            )}

            {pricingRouteError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
                {pricingRouteError}
              </div>
            )}

            {/* ==========================================
                DATE + PASSENGERS
            ========================================== */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Tour Date */}
              <div>
                <label
                  htmlFor="tour-date"
                  className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
                >
                  Tour Date
                </label>

                <input
                  id="tour-date"
                  type="date"
                  value={tourDate}
                  onChange={(event) =>
                    setTourDate(
                      event.target.value
                    )
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
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

              {/* Number of Passengers */}
              <div>
                <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                  Number of Passengers
                </label>

                <div className="flex h-[48px] w-full items-center rounded-md border border-[var(--border-light)] bg-white">
                  {/* Minus */}
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

                  {/* Number Input */}
                  <input
                    type="number"
                    min="1"
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

                  {/* Plus */}
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

            {/* ==========================================
                DAY TOUR ROUTE
            ========================================== */}
            <Select
              label="Day Tour Route"
              placeholder={
                pricingRoutesLoading
                  ? "Loading day tour routes..."
                  : "Select Day Tour Route"
              }
              value={selectedPricingRoute}
              onChange={handlePricingRouteChange}
              options={pricingRoutes.map((route) => ({
                label: `${route.fromLocation} → ${route.toLocation}`,
                value: String(route.id),
              }))}
            />

            {!pricingRoutesLoading && pricingRoutes.length === 0 && (
              <p className="mt-2 text-[12px] font-medium text-red-600">
                No active day tour routes found. Please add an active route in Admin Pricing.
              </p>
            )}

            {/* ==========================================
                MEETING LOCATION
            ========================================== */}
            <div>
              <label
                htmlFor="meeting-location"
                className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
              >
                Meeting / Pickup Location
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

                <Input
                  id="meeting-location"
                  className="pl-11"
                  placeholder="Enter your hotel or pickup location"
                  value={
                    meetingLocation
                  }
                  onChange={(event) =>
                    setMeetingLocation(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* ==========================================
                TOUR DESTINATION
            ========================================== */}
            <div>
              <label
                htmlFor="tour-destination"
                className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
              >
                Main Tour Destination
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

                <Input
                  id="tour-destination"
                  className="pl-11"
                  placeholder="e.g., Galle Fort, Kandy, Sigiriya"
                  value={
                    tourDestination
                  }
                  onChange={(event) =>
                    setTourDestination(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* ==========================================
                RETURN / DROP LOCATION
            ========================================== */}
            <div>
              <label
                htmlFor="drop-location"
                className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]"
              >
                Return / Drop Location
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

                <Input
                  id="drop-location"
                  className="pl-11"
                  placeholder="Enter return or final drop location"
                  value={
                    dropLocation
                  }
                  onChange={(event) =>
                    setDropLocation(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* ==========================================
                VEHICLE SEARCH
            ========================================== */}
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
                <div className="relative">
                  <Input
                    id="vehicle-search"
                    placeholder="Search vehicle or fleet class..."
                    value={
                      vehicleSearch
                    }
                    onChange={(event) => {
                      setVehicleSearch(
                        event.target.value
                      );

                      setSelectedVehicleId(
                        null
                      );
                    }}
                  />

                  {/* Suggestions */}
                  {vehicleSearch.trim() !==
                    "" &&
                    !selectedVehicle && (
                      <div
                        className="
                          absolute
                          left-0
                          right-0
                          top-[calc(100%+6px)]
                          z-20
                          overflow-hidden
                          rounded-xl
                          border
                          border-[var(--border-light)]
                          bg-white
                          shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                        "
                      >
                        {filteredVehicles.length >
                        0 ? (
                          filteredVehicles.map(
                            (
                              vehicle
                            ) => (
                              <button
                                key={
                                  vehicle.id
                                }
                                type="button"
                                onClick={() => {
                                  setSelectedVehicleId(
                                    vehicle.id
                                  );

                                  setVehicleSearch(
                                    vehicle.name
                                  );
                                }}
                                className="
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  px-4
                                  py-3
                                  text-left
                                  transition
                                  hover:bg-[var(--green-primary)]/5
                                "
                              >
                                <span className="text-[14px] font-medium text-[var(--text-primary)]">
                                  {
                                    vehicle.name
                                  }
                                </span>

                                <span className="text-[12px] text-[var(--text-secondary)]">
                                  {vehicle.transmission ??
                                    vehicle.fuelType ??
                                    "Available Vehicle"}
                                </span>
                              </button>
                            )
                          )
                        ) : (
                          <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                            No vehicles found.
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}

              {/* Selected Vehicle */}
              {selectedVehicle && (
                <p className="mt-2 text-[12px] text-[var(--text-secondary)]">
                  Vehicle selected: {" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {vehicleSearch}
                  </span>
                </p>
              )}
            </div>

            {/* ==========================================
                LUGGAGE
            ========================================== */}
            <Select
              label="Luggage Requirements"
              placeholder="Select Bag Count"
              value={luggage}
              onChange={(event) =>
                setLuggage(
                  event.target.value
                )
              }
              options={[
                {
                  label:
                    "No Luggage",
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
                  value: "4",
                },
              ]}
            />

            {/* ==========================================
                SPECIAL REQUIREMENTS
            ========================================== */}
            <Textarea
              label="Special Requirements"
              placeholder="Specify preferred start time, extra stops, or any other requirements..."
              value={
                specialRequirements
              }
              onChange={(event) =>
                setSpecialRequirements(
                  event.target.value
                )
              }
            />

            {/* ==========================================
                CONTINUE BUTTON
            ========================================== */}
            <div className="flex justify-end pt-1">
              <Button
                onClick={
                  handleContinue
                }
                disabled={
                  loadingVehicles ||
                  pricingRoutesLoading
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