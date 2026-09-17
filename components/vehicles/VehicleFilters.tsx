import Select from "@/components/ui/Select";

export default function VehicleFilters() {
  return (
    <div className="bg-[#F5F7F5]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-end gap-4 px-10 py-8">
        {/* Filter title */}
        <div className="mb-3 text-sm font-bold">
          FILTER BY
        </div>

        {/* Vehicle type */}
        <div className="w-[200px]">
          <Select
            label="Type"
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
        <div className="w-[200px]">
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
        <div className="w-[200px]">
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
      </div>
    </div>
  );
}