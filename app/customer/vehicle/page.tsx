import Image from "next/image";
import {
  Users,
  Luggage,
  Settings2,
  Fuel,
  Check,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Breadcrumb from "@/components/common/Breadcrumb";
import SectionTitle from "@/components/common/SectionTitle";
import InfoRow from "@/components/common/InfoRow";

import VehicleSpec from "@/components/vehicles/VehicleSpec";

import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";

const vehicle = {
  name: "Premium Hybrid Sedan",
  category: "Premium Sedan",
  image: "/images/featuredvehicle1.png",
  passengers: "4 Passengers",
  luggage: "2 Large Bags",
  transmission: "Automatic",
  fuel: "Hybrid",
  description:
    "A refined and comfortable sedan designed for private airport transfers, day trips, and longer journeys across Sri Lanka.",
};

export default function VehicleDetailsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F7F1]">
        
        {/* BREADCRUMB */}
        <div className="bg-white">
          <div className="mx-auto w-full max-w-[1180px] px-8 py-5 md:px-10">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Vehicles", href: "/customer/vehicles" },
                { label: vehicle.name },
              ]}
            />
          </div>
        </div>

        {/* VEHICLE DETAILS */}
        <section className="py-10 md:py-14">

          <div className="mx-auto w-full max-w-[1180px] px-8 md:px-10">
            {/* MAIN VEHICLE CARD */}
            <div className="group overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_18px_50px_rgba(7,91,69,0.08)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(7,91,69,0.13)]">
              <div className="grid lg:grid-cols-[1.08fr_1fr]">
                {/* VEHICLE IMAGE */}
                <div className="relative min-h-[340px] overflow-hidden bg-[var(--surface-soft)] md:min-h-[470px]">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />

                  {/* Category Badge */}
                  <div className="absolute left-5 top-5">
                    <span className="inline-flex rounded-full bg-[var(--yellow-golden)] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--green-dark)] shadow-sm">
                      {vehicle.category}
                    </span>
                  </div>

                  {/* Image Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-[var(--green-primary)]" />
                </div>

                {/* VEHICLE INFORMATION */}
                <div className="flex flex-col justify-center px-6 py-8 md:px-9 md:py-10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--green-primary)]">
                    Travel in Comfort
                  </p>

                  <h1 className="mt-2 font-serif text-[36px] font-semibold leading-tight text-[var(--green-dark)] md:text-[40px]">
                    {vehicle.name}
                  </h1>

                  <p className="mt-4 max-w-[560px] text-[14px] leading-7 text-[var(--text-secondary)]">
                    {vehicle.description}
                  </p>

                  {/* Vehicle Specs */}
                  <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
                    <VehicleSpec
                      icon={<Users size={20} />}
                      label="Passengers"
                      value={vehicle.passengers}
                    />

                    <VehicleSpec
                      icon={<Luggage size={20} />}
                      label="Luggage"
                      value={vehicle.luggage}
                    />

                    <VehicleSpec
                      icon={<Settings2 size={20} />}
                      label="Transmission"
                      value={vehicle.transmission}
                    />

                    <VehicleSpec
                      icon={<Fuel size={20} />}
                      label="Fuel Type"
                      value={vehicle.fuel}
                    />
                  </div>

                  {/* INCLUDED */}
                  <div className="mt-8 rounded-xl border border-[var(--green-primary)]/15 bg-[var(--surface-soft)]">
                    <div className="border-b border-[var(--border-light)] px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--green-dark)]">
                        Included With Your Journey
                      </p>
                    </div>

                    <div className="px-4 py-1">
                      <InfoRow
                        label="Air Conditioning"
                        value="Available"
                      />

                      <InfoRow
                        label="Chauffeur"
                        value="English-Speaking"
                      />

                      <InfoRow
                        label="Travel Type"
                        value="Private"
                      />
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      href="/customer/booking/airport-transfer"
                      className="
                        min-w-[175px]
                        !bg-[var(--green-dark)]
                        hover:!bg-[var(--green-forest)]
                      "
                    >
                      Book This Vehicle
                    </Button>

                    <Button
                      href="/customer/vehicles"
                      variant="outline"
                      className="
                        min-w-[175px]
                        !border-[var(--yellow-golden)]
                        !text-[var(--green-dark)]
                        hover:!bg-[var(--yellow-golden)]
                      "
                    >
                      View Other Vehicles
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* MORE ABOUT VEHICLE */}
            <section className="mx-auto mt-16 max-w-[820px] text-center">
              <SectionTitle title="More About The Vehicle" />

              <p className="mx-auto mt-5 max-w-[720px] text-[13px] leading-7 text-[var(--text-secondary)]">
                This vehicle is suitable for couples, families, and small
                groups looking for a comfortable private travel experience.
                Your journey includes an experienced English-speaking
                chauffeur who can assist with your route and local travel
                arrangements.
              </p>

              {/* Small Feature Row */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-[var(--green-primary)]/20 bg-white px-4 py-2 text-[12px] font-semibold text-[var(--green-dark)] shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--green-primary)] text-white">
                    <Check size={12} />
                  </span>
                  Private Travel
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[var(--yellow-golden)]/40 bg-white px-4 py-2 text-[12px] font-semibold text-[var(--green-dark)] shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--yellow-golden)] text-[var(--green-dark)]">
                    <Check size={12} />
                  </span>
                  English-Speaking Chauffeur
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[var(--sky-blue)]/30 bg-white px-4 py-2 text-[12px] font-semibold text-[var(--green-dark)] shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sky-blue)] text-white">
                    <Check size={12} />
                  </span>
                  Comfortable Journey
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}