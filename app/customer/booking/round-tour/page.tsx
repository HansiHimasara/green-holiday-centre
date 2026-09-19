"use client";

import { useState } from "react";

import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import RoundTourNights from "@/components/bookings/RoundTourNights";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function RoundTourPage() {
  const [startDate, setStartDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [luggage, setLuggage] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

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

  const filteredVehicles = vehicles.filter((vehicle) => {
    const search = vehicleSearch.toLowerCase();

    return (
      vehicle.name.toLowerCase().includes(search) ||
      vehicle.category.toLowerCase().includes(search)
    );
  });

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
      {/* TOP WHITE AREA */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-6 pt-7 md:px-10">
          <ServiceTabs active="round-tour" />
        </div>

        <div className="mt-10 border-b border-[var(--border-light)]">
          <div className="mx-auto w-full max-w-[1280px] px-6 pb-6 md:px-10">
            <BookingStepHeader
              title="Your Travel Details — For Round Tours"
              step={1}
              totalSteps={4}
            />
          </div>
        </div>
      </section>

      {/* FORM AREA */}
      <section className="bg-[#F5F7F5] py-9">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="space-y-8">

            {/* Date + Passengers */}
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
                  className="h-[48px] w-full rounded-md border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--green-primary)] focus:ring-1 focus:ring-[var(--green-primary)]"
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
                    className="flex h-full w-14 items-center justify-center text-[22px] font-medium text-[var(--text-primary)] transition hover:bg-[#F5F7F5] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease passengers"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={passengers}
                    onChange={handlePassengerInput}
                    className="h-full flex-1 border-x border-[var(--border-light)] bg-transparent text-center text-[15px] font-semibold text-[var(--text-primary)] outline-none"
                    aria-label="Number of passengers"
                  />

                  <button
                    type="button"
                    onClick={increasePassengers}
                    className="flex h-full w-14 items-center justify-center text-[22px] font-medium text-[var(--text-primary)] transition hover:bg-[#F5F7F5]"
                    aria-label="Increase passengers"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Preference */}
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
                    <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-md border border-[var(--border-light)] bg-white shadow-lg">
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                          <button
                            key={vehicle.id}
                            type="button"
                            onClick={() => {
                              setSelectedVehicle(vehicle.id);
                              setVehicleSearch(vehicle.name);
                            }}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#F5F7F5]"
                          >
                            <span className="text-[14px] font-medium text-[var(--text-primary)]">
                              {vehicle.name}
                            </span>

                            <span className="text-[12px] text-[#66736A]">
                              {vehicle.category}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-[13px] text-[#66736A]">
                          No vehicles found.
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {selectedVehicle && (
                <p className="mt-2 text-[12px] text-[#66736A]">
                  Vehicle selected:{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {vehicleSearch}
                  </span>
                </p>
              )}
            </div>

            {/* Luggage */}
            <Select
              label="Luggage Requirements"
              placeholder="Select Bag Count"
              value={luggage}
              onChange={(event) => setLuggage(event.target.value)}
              options={[
                { label: "No Luggage", value: "0" },
                { label: "1 Bag", value: "1" },
                { label: "2 Bags", value: "2" },
                { label: "3 Bags", value: "3" },
                { label: "4+ Bags", value: "4+" },
              ]}
            />

            {/* Night Destinations */}
            <div>
              <div className="mb-5">
                <h2 className="text-[18px] font-bold text-[var(--green-dark)]">
                  Night Destinations
                </h2>

                {/* Information Notice */}
                <div className="mt-3 flex items-start gap-2 rounded-md border border-[#F1D8AA] bg-[#FFFEFA] px-4 py-3 text-[12px] font-medium text-[#26342B]">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#E89A16"
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
                    Three nights are shown initially. Add another night only
                    if your tour requires it.
                  </p>
                </div>
              </div>

              <RoundTourNights />
            </div>

            {/* Special Notes */}
            <Textarea
              label="Special Notes or Requirements"
              placeholder="Tell us about preferred destinations, activities, accessibility requirements, or anything else..."
              value={specialNotes}
              onChange={(event) => setSpecialNotes(event.target.value)}
            />

            {/* Continue */}
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