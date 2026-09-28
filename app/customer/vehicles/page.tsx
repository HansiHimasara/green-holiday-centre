export const dynamic = "force-dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import PageTitle from "@/components/common/PageTitle";
import VehicleFilters from "@/components/vehicles/VehicleFilters";
import VehicleCard from "@/components/vehicles/VehicleCard";
import DecorativePattern from "@/components/ui/DecorativePattern";
import { activeVehicles, vehicleCategory } from "@/src/server/vehicles";

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<{ category?: string; passengers?: string; luggage?: string }> }) {
  const filters = await searchParams;
  const rows = await activeVehicles();
  const vehicles = rows.filter(vehicle => {
    const category = vehicleCategory(vehicle.name);
    const matchesCategory = !filters.category || category.toLowerCase() === filters.category.toLowerCase();
    const passengerRange = filters.passengers === "1-4" ? [1, 4] : filters.passengers === "5-9" ? [5, 9] : filters.passengers === "10+" ? [10, Infinity] : [0, Infinity];
    const luggageRange = filters.luggage === "1-3" ? [1, 3] : filters.luggage === "4-6" ? [4, 6] : filters.luggage === "7+" ? [7, Infinity] : [0, Infinity];
    return matchesCategory && vehicle.passengerCapacity >= passengerRange[0] && vehicle.passengerCapacity <= passengerRange[1]
      && vehicle.luggageCapacity >= luggageRange[0] && vehicle.luggageCapacity <= luggageRange[1];
  }).map(vehicle => ({
    name: vehicle.name, image: vehicle.imageUrl || "/images/vehicle-placeholder.svg", passengers: vehicle.passengerCapacity, luggage: vehicle.luggageCapacity, category: vehicleCategory(vehicle.name), href: `/customer/vehicles/${vehicle.id}`,
  }));
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F7F1]">
        {/* Page Hero */}
        <section className="relative overflow-hidden bg-[#F4F7F1]">
          <DecorativePattern position="top-right" />

          <div className="relative z-10 mx-auto w-full max-w-[1180px] px-8 py-16 md:px-10 md:py-20">
            <PageTitle
              eyebrow="Our Fleet"
              title="Our Vehicles"
              description="Explore our selection of reliable and comfortable vehicles designed for private journeys across Sri Lanka."
            />

            {/* Equal Colour Dashes */}
            <div className="mx-auto mt-7 flex w-fit items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-[var(--green-primary)]" />
              <span className="h-1.5 w-6 rounded-full bg-[var(--yellow-golden)]" />
              <span className="h-1.5 w-6 rounded-full bg-[var(--sky-blue)]" />
            </div>
          </div>
        </section>

        {/* Vehicle Filters */}
        <section className="relative z-20 -mt-5">
          <div className="mx-auto w-full max-w-[1180px] px-8 md:px-10">
            <VehicleFilters />
          </div>
        </section>

        {/* Fleet Introduction */}
        <section className="mx-auto w-full max-w-[1180px] px-8 pb-5 pt-16 md:px-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--green-primary)]">
                Travel Your Way
              </span>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--green-dark)]">
                Choose the vehicle for your journey
              </h2>
            </div>

            <p className="max-w-[420px] text-sm leading-6 text-[#6F746F] md:text-right">
              From comfortable airport transfers to longer journeys across
              Sri Lanka, our fleet is selected to make every trip easier.
            </p>
          </div>
        </section>

        {/* Vehicle Grid */}
        <section className="mx-auto w-full max-w-[1180px] px-8 pb-20 pt-8 md:px-10">
          <div className="grid gap-8 md:grid-cols-2">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.href}
                name={vehicle.name}
                image={vehicle.image}
                passengers={vehicle.passengers}
                luggage={vehicle.luggage}
                category={vehicle.category}
                href={vehicle.href}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}