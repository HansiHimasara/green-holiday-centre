"use client";

import {
  type ChangeEvent,
  useEffect,
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
  id: string;
  name: string;
  category: string;
  passengerCapacity: number;
  luggageCapacity: number;
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

export default function AirportTransferPage() {
  const router = useRouter();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [selectedPricingRoute, setSelectedPricingRoute] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [luggage, setLuggage] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pricingRoutes, setPricingRoutes] = useState<PricingRoute[]>([]);
  const [pricingRoutesLoading, setPricingRoutesLoading] = useState(true);

  // ==========================================
  // LOAD SAVED BOOKING DETAILS
  // ==========================================

  useEffect(() => {
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

    if (draft.pricingId) {
      setSelectedPricingRoute(String(draft.pricingId));
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
      setLuggage(
        draft.luggageCount >= 4
          ? "4+"
          : String(draft.luggageCount)
      );
    }

    if (draft.specialRequests) {
      setSpecialRequirements(draft.specialRequests);
    }
  }, []);

  // ==========================================
  // LOAD VEHICLES FROM DATABASE
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load vehicles.");
        }

        const loadedVehicles: Vehicle[] = Array.isArray(data.vehicles)
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
                  [vehicle.transmission, vehicle.fuelType]
                    .filter(Boolean)
                    .join(" • ") ||
                  vehicle.description ||
                  "Available Vehicle",
                passengerCapacity: vehicle.passengerCapacity,
                luggageCapacity: vehicle.luggageCapacity,
              })
            )
          : [];

        if (!cancelled) {
          setVehicles(loadedVehicles);
        }
      } catch (error) {
        console.error("Load vehicles error:", error);

        if (!cancelled) {
          setVehicles([]);
        }
      }
    };

    void loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // LOAD ACTIVE PRICING ROUTES
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadPricingRoutes = async () => {
      try {
        setPricingRoutesLoading(true);

        const response = await fetch("/api/pricing-routes", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load pricing routes.");
        }

        const loadedRoutes: PricingRoute[] = Array.isArray(data.routes)
          ? data.routes
          : [];

        if (!cancelled) {
          setPricingRoutes(loadedRoutes);
        }
      } catch (error) {
        console.error("Load pricing routes error:", error);

        if (!cancelled) {
          setPricingRoutes([]);
        }
      } finally {
        if (!cancelled) {
          setPricingRoutesLoading(false);
        }
      }
    };

    void loadPricingRoutes();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // VEHICLE SEARCH
  // ==========================================

  const filteredVehicles = vehicles.filter((vehicle) => {
    const search = vehicleSearch.toLowerCase();

    return (
      vehicle.name.toLowerCase().includes(search) ||
      vehicle.category.toLowerCase().includes(search)
    );
  });

  // ==========================================
  // PASSENGER CONTROLS
  // ==========================================

  const increasePassengers = () => {
    setPassengers((current) => current + 1);
  };

  const decreasePassengers = () => {
    setPassengers((current) => Math.max(1, current - 1));
  };

  const handlePassengerInput = (
    event: ChangeEvent<HTMLInputElement>
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

  const handlePricingRouteChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    setSelectedPricingRoute(value);

    const route = pricingRoutes.find(
      (pricingRoute) => String(pricingRoute.id) === value
    );

    if (!route) {
      setPickupLocation("");
      setDropLocation("");
      return;
    }

    setPickupLocation(route.fromLocation);
    setDropLocation(route.toLocation);
  };

  const handleContinue = () => {
    const selectedVehicleData = vehicles.find(
      (vehicle) => vehicle.id === selectedVehicle
    );

    if (!travelDate) {
      window.alert("Please select your travel date.");
      return;
    }

    if (!selectedPricingRoute) {
      window.alert("Please select an airport transfer route.");
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

    if (!selectedVehicleData) {
      window.alert("Please select a vehicle.");
      return;
    }

    if (luggage === "") {
      window.alert("Please select the luggage requirement.");
      return;
    }

    const luggageCount = luggage === "4+" ? 4 : Number(luggage);

    if (passengers > selectedVehicleData.passengerCapacity) {
      window.alert(
        `${selectedVehicleData.name} allows a maximum of ${selectedVehicleData.passengerCapacity} passengers.`
      );
      return;
    }

    if (luggageCount > selectedVehicleData.luggageCapacity) {
      window.alert(
        `${selectedVehicleData.name} allows a maximum of ${selectedVehicleData.luggageCapacity} luggage items.`
      );
      return;
    }

    saveBookingDraft({
      serviceType: "AIRPORT_TRANSFER",
      pricingId: Number(selectedPricingRoute),
      vehicleTypeId: Number(selectedVehicleData.id),
      vehicleName: selectedVehicleData.name,
      travelDate,
      returnDate: undefined,
      passengerCount: passengers,
      luggageCount,
      numberOfNights: undefined,
      pickupLocation: pickupLocation.trim(),
      dropoffLocation: dropLocation.trim(),
      flightNumber: undefined,
      specialRequests: specialRequirements.trim(),
      destinations: [],
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
            <ServiceTabs active="airport-transfer" />
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
              Airport Transfers
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
              Start Your Journey Smoothly
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
              Enjoy a comfortable and reliable airport transfer with a
              professional chauffeur, whether you are arriving in or departing
              from Sri Lanka.
            </p>

            {/* Decorative Service Color Bars */}
            <ServiceColorDashes active="airport-transfer" />
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
      <section className="relative overflow-hidden bg-[#F8F7F1] py-10">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10">
          {/* ==========================================
              NOTICE
          ========================================== */}
          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-[var(--yellow-golden)]/30
              bg-[var(--yellow-warm)]/10
              px-5
              py-4
              text-[12px]
              font-medium
              text-[var(--text-primary)]
            "
          >
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
              Please note: Either your Pickup or Dropoff Location must
              originate from or terminate at the Airport for this booking
              service.
            </p>
          </div>

          {/* ==========================================
              FORM
          ========================================== */}
          <div className="mt-9 space-y-8">
            {/* ==========================================
                DATE + PASSENGERS
            ========================================== */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Date of Travel */}
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
                  onChange={(event) => setTravelDate(event.target.value)}
                  min={new Date().toISOString().split("T")[0]}
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
                  <button
                    type="button"
                    onClick={decreasePassengers}
                    disabled={passengers <= 1}
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
                    value={passengers}
                    onChange={handlePassengerInput}
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
                    onClick={increasePassengers}
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
                AIRPORT TRANSFER ROUTE
            ========================================== */}
            <div>
              <Select
                label="Airport Transfer Route"
                placeholder={
                  pricingRoutesLoading
                    ? "Loading airport routes..."
                    : "Select Airport Transfer Route"
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
                  No active airport transfer routes found. Please add an active
                  route in Admin Pricing.
                </p>
              )}

              {selectedPricingRoute && (
                <p className="mt-2 text-[12px] text-[var(--text-secondary)]">
                  You can edit the exact drop location below. The final price
                  will be calculated from the real road distance.
                </p>
              )}
            </div>

            {/* ==========================================
                PICKUP LOCATION
            ========================================== */}
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
                  stroke="var(--green-primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

                <Input
                  className="pl-11"
                  placeholder="Select an airport route first"
                  value={pickupLocation}
                  onChange={(event) =>
                    setPickupLocation(event.target.value)
                  }
                />
              </div>
            </div>

            {/* ==========================================
                DROP LOCATION
            ========================================== */}
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
                  stroke="var(--green-primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

                <Input
                  className="pl-11"
                  placeholder="e.g., Cinnamon Grand Colombo, Sri Lanka"
                  value={dropLocation}
                  onChange={(event) =>
                    setDropLocation(event.target.value)
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

              <div className="relative">
                <Input
                  id="vehicle-search"
                  placeholder="Search vehicle or fleet class..."
                  value={vehicleSearch}
                  onChange={(event) => {
                    setVehicleSearch(event.target.value);
                    setSelectedVehicle("");
                  }}
                />

                {vehicleSearch.trim() !== "" &&
                  selectedVehicle === "" && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                          <button
                            key={vehicle.id}
                            type="button"
                            onClick={() => {
                              setSelectedVehicle(vehicle.id);
                              setVehicleSearch(vehicle.name);
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
                              {vehicle.name}
                            </span>

                            <span className="text-[12px] text-[var(--text-secondary)]">
                              {vehicle.category}
                            </span>
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

              {selectedVehicle && (
                <p className="mt-2 text-[12px] text-[var(--text-secondary)]">
                  Vehicle selected:{" "}
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
              onChange={(event) => setLuggage(event.target.value)}
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

            {/* ==========================================
                SPECIAL REQUIREMENTS
            ========================================== */}
            <Textarea
              label="Special Requirements or Flight Information"
              placeholder="Enter flight number, required infant seats, extra surfboards, or transit instructions..."
              value={specialRequirements}
              onChange={(event) =>
                setSpecialRequirements(event.target.value)
              }
            />

            {/* ==========================================
                CONTINUE BUTTON
            ========================================== */}
            <div className="flex justify-end pt-1">
              <Button
                onClick={handleContinue}
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