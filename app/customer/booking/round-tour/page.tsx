"use client";

import { useState } from "react";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import ServiceColorDashes from "@/components/bookings/ServiceColorDashes";
import RoundTourNights from "@/components/bookings/RoundTourNights";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

export default function RoundTourPage() {
  // ==========================================
  // FORM STATE
  // ==========================================

  const [startDate, setStartDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [luggage, setLuggage] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  // ==========================================
  // TEMPORARY VEHICLE DATA
  // Replace this with database data later
  // ==========================================

  const vehicles = [
    {
      id: "toyota-prius",
      name: "Toyota Prius",
      category: "Premium Sedan",
    },
    {
      id: "toyota-kdh",
      name: "Toyota KDH",
      category: "Executive Minivan",
    },
    {
      id: "toyota-hiace",
      name: "Toyota Hiace",
      category: "Executive Minivan",
    },
    {
      id: "toyota-rav4",
      name: "Toyota RAV4",
      category: "Luxury SUV",
    },
    {
      id: "mercedes-s-class",
      name: "Mercedes S-Class",
      category: "Luxury Sedan",
    },
  ];

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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (value === "") {
      setPassengers(1);
      return;
    }

    const number = Number(value);

    if (!Number.isNaN(number)) {
      setPassengers(Math.max(1, number));
    }
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
            <ServiceTabs active="round-tour" />
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
              Round Tours
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
              Journey Across Sri Lanka
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
              Plan a memorable journey across Sri Lanka with a private
              vehicle, experienced chauffeur, and flexible overnight stays
              along your route.
            </p>

            {/* Service Colour Indicator */}
            <ServiceColorDashes active="round-tour" />
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
              title="Your Travel Details — For Round Tours"
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
          <div className="space-y-8">
            {/* ==========================================
                DATE + PASSENGERS
            ========================================== */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Start Date */}
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
                  onChange={(event) => setStartDate(event.target.value)}
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
                  {/* Minus */}
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

                  {/* Number Input */}
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

                  {/* Plus */}
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
                VEHICLE PREFERENCE
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

                {/* Suggestions */}
                {vehicleSearch.trim() !== "" &&
                  selectedVehicle === "" && (
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

              {/* Selected Vehicle */}
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
                NIGHT DESTINATIONS
            ========================================== */}
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[var(--green-primary)]" />

                  <h2 className="text-[18px] font-bold text-[var(--green-dark)]">
                    Night Destinations
                  </h2>
                </div>

                {/* Information Notice */}
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
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5" />
                    <path d="M12 16h.01" />
                  </svg>

                  <p>
                    Three nights are shown initially. Add another night only
                    if your tour requires it.
                  </p>
                </div>
              </div>

              <RoundTourNights />
            </div>

            {/* ==========================================
                SPECIAL NOTES
            ========================================== */}
            <Textarea
              label="Special Notes or Requirements"
              placeholder="Tell us about preferred destinations, activities, accessibility requirements, or anything else..."
              value={specialNotes}
              onChange={(event) => setSpecialNotes(event.target.value)}
            />

            {/* ==========================================
                CONTINUE
            ========================================== */}
            <div className="flex justify-end pt-1">
              <Button
                href="/customer/booking/customer-details"
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