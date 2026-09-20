import Select from "@/components/ui/Select";

export default function VehicleFilters() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[var(--green-deep)] px-7 py-7 shadow-[0_18px_45px_rgba(8,112,82,0.16)] md:px-9 md:py-8">
      {/* Decorative accents */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FFD34E]/15" />

      <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-[#5B8DB8]/15" />

      <div className="relative z-10 flex flex-col gap-7">
        {/* Filter heading */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#FFD34E]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD34E]">
                Our Fleet
              </span>
            </div>

            <h2 className="font-serif text-2xl font-semibold  !text-white md:text-[28px]">
              Find Your Perfect Ride
            </h2>

            <p className="mt-2 max-w-[560px] text-sm leading-6 text-white/70">
              Choose a vehicle that matches your journey, group size and
              luggage needs.
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-[#FFD34E]" />
            <span className="h-2 w-2 rounded-full bg-[#90C543]" />
            <span className="h-2 w-2 rounded-full bg-[#5B8DB8]" />
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm md:p-6">
          <div className="flex flex-wrap items-end gap-5">
            {/* Vehicle type */}
            <div className="min-w-[200px] flex-1">
              <Select
                label="Vehicle Type"
                placeholder="All Categories"
                options={[
                  { label: "Sedan", value: "sedan" },
                  { label: "SUV", value: "suv" },
                  { label: "Minivan", value: "minivan" },
                  { label: "Bus", value: "bus" },
                ]}
              />
            </div>

            {/* Passenger count */}
            <div className="min-w-[200px] flex-1">
              <Select
                label="Passengers"
                placeholder="Any Passenger Count"
                options={[
                  { label: "1 - 4", value: "1-4" },
                  { label: "5 - 9", value: "5-9" },
                  { label: "10+", value: "10+" },
                ]}
              />
            </div>

            {/* Luggage capacity */}
            <div className="min-w-[200px] flex-1">
              <Select
                label="Luggage"
                placeholder="Any Luggage Capacity"
                options={[
                  {
                    label: "1 - 3 Bags",
                    value: "1-3",
                  },
                  {
                    label: "4 - 6 Bags",
                    value: "4-6",
                  },
                  {
                    label: "7+ Bags",
                    value: "7+",
                  },
                ]}
              />
            </div>

            {/* Filter button */}
            <button
              type="button"
              className="
                h-[50px]
                rounded-xl
                bg-[#FFD34E]
                px-7
                text-sm
                font-bold
                text-[var(--green-dark)]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#FFE27A]
                hover:shadow-lg
              "
            >
              Find Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}