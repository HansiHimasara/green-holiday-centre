export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ServiceCards from "@/components/home/ServiceCards";
import DecorativePattern from "@/components/ui/DecorativePattern";
import FeatureItem from "@/components/home/FeatureItem";
import ScrollReveal from "@/components/ui/ScrollReveal";
import HeroGallery from "@/components/home/HeroGallery";
import { activeVehicles, vehicleCategory } from "@/src/server/vehicles";

const services = [
  {
    title: "Round Tours",
    description:
      "Thoughtfully planned multi-day journeys with a dedicated English-speaking chauffeur to guide you across Sri Lanka.",
    image: "/images/ourservice1.png",
    href: "/customer/booking/round-tour",
  },
  {
    title: "Day Trips",
    description:
      "Discover heritage sites, tranquil beaches, tea country, scenic landscapes, and the hidden beauty of the island.",
    image: "/images/ourservice2.png",
    href: "/customer/booking/day-tour",
  },
  {
    title: "Airport Transfers",
    description:
      "Seamless and reliable transfers between Bandaranaike International Airport and your destination.",
    image: "/images/ourservice3.png",
    href: "/customer/booking/airport-transfer",
  },
];

export default async function HomePage() {
  const vehicles = await activeVehicles();
  const featuredVehicles = (["Sedan", "SUV", "Bus"] as const).flatMap(category => vehicles.filter(vehicle => vehicleCategory(vehicle.name) === category).slice(0, 3)).map(vehicle => ({
    name: vehicle.name, image: vehicle.imageUrl || "/images/vehicle-placeholder.svg", passengers: vehicle.passengerCapacity, bags: vehicle.luggageCapacity, href: `/customer/vehicles/${vehicle.id}`,
  }));
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="relative min-h-[600px] overflow-hidden bg-[#092117] md:min-h-[650px]">
          <HeroGallery />

          {/* Stronger overlay on mobile so text stays readable */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,20,13,0.85)_0%,rgba(4,20,13,0.68)_100%)] md:bg-[linear-gradient(90deg,rgba(4,20,13,0.76)_0%,rgba(4,20,13,0.45)_45%,rgba(4,20,13,0.16)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[600px] w-full max-w-[1280px] items-center px-6 py-16 sm:px-8 md:min-h-[650px] md:px-10 md:py-24">
            <div className="w-full max-w-[1000px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/85 sm:text-[11px] md:text-[12px] md:tracking-[0.3em]">
                Travel With Experience
              </p>
              <br></br>

              <h1 className="mt-7 max-w-[900px] font-[var(--font-display)] text-[clamp(34px,9vw,48px)] font-normal leading-[1.12] tracking-[-0.02em] !text-white md:mt-12 md:text-[64px] md:leading-[1.15]">
                You Experience.
                <br />
                We Make the Travel Happen.
              </h1>
              <br></br>

              <p className="mt-6 max-w-[600px] text-[14px] font-normal leading-6 text-white/85 sm:text-[15px] sm:leading-7 md:mt-12 md:max-w-none md:whitespace-nowrap md:text-[16px]">
                Discover Sri Lanka in comfort with a private vehicle and an
                experienced English-speaking chauffeur.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5 md:mt-10">
                <Link
                  href="/customer/booking"
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-visible rounded-md bg-[var(--green-primary)] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] !text-white shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--green-dark)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] sm:w-auto sm:px-7 sm:tracking-[0.18em]"
                >
                  <span className="pointer-events-none absolute -left-2 -top-2 h-1.5 w-1.5 rotate-45 bg-white opacity-0 shadow-[0_0_9px_2px_rgba(255,255,255,0.75)] transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:scale-125 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute -top-2 left-[45%] h-1 w-1 rotate-45 bg-white opacity-0 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] transition-all delay-100 duration-500 group-hover:-translate-y-1 group-hover:scale-150 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute -right-2 top-1/2 h-1.5 w-1.5 rotate-45 bg-white opacity-0 shadow-[0_0_9px_2px_rgba(255,255,255,0.75)] transition-all delay-150 duration-500 group-hover:translate-x-1 group-hover:scale-125 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-[-3px] right-[28%] h-1 w-1 rotate-45 bg-white opacity-0 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] transition-all delay-200 duration-500 group-hover:translate-y-1 group-hover:scale-150 group-hover:opacity-100" />

                  <span className="relative z-10">Begin Your Journey</span>
                  <span className="relative z-10 text-[15px] transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/customer/vehicles"
                  className="group inline-flex items-center gap-2 px-1 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] !text-white/90 transition-colors duration-300 hover:!text-white"
                >
                  Explore Our Fleet
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="relative overflow-hidden bg-[#F8FAF7] py-16">
          <DecorativePattern position="top-right" />

          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-8 md:px-10">
            <ScrollReveal>
              <div className="max-w-[720px]">
                <div className="mb-3 flex items-center gap-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[var(--green-primary)]">
                    Our Services
                  </p>
                  <span className="h-px w-8 bg-[var(--yellow-golden)]" />
                </div>

                <h2 className="font-[var(--font-display)] text-[36px] font-semibold leading-[1.15] text-[var(--green-dark)] md:text-[42px]">
                  Journeys made effortless.
                </h2>

                <p className="mt-4 max-w-[640px] text-[14px] leading-7 text-[var(--text-secondary)]">
                  From the moment you arrive to the moment you leave, we make
                  exploring Sri Lanka comfortable, personal, and beautifully
                  simple.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-9">
              <ScrollReveal delay={120}>
                <ServiceCards services={services} />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FEATURED VEHICLES */}
        <section className="relative overflow-hidden py-20 md:py-24">
          <Image
            src="/images/sri-lanka-cta.jpg"
            alt=""
            fill
            className="z-0 object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 z-10 bg-black/65" />

          <div className="relative z-20 mx-auto w-full max-w-[1280px] px-8 md:px-10">
            <ScrollReveal>
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.28em] text-white/75">
                    Our Fleet
                  </p>

                  <h2 className="font-[var(--font-display)] text-[36px] font-semibold leading-[1.2] !text-white md:text-[42px]">
                    Travel in comfort.
                  </h2>

                  <p className="mt-5 max-w-[620px] text-[14px] leading-7 text-white/80">
                    A carefully selected fleet designed for comfortable,
                    relaxed, and dependable journeys.
                  </p>
                </div>

                <Link
                  href="/customer/vehicles"
                  className="group inline-flex items-center gap-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] !text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  View All Vehicles
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </ScrollReveal>

            <div className="mt-10">
              <ScrollReveal delay={120}>
                <div className="grid gap-8 md:grid-cols-3">
                  {featuredVehicles.map((vehicle) => (
                    <Card
                      key={vehicle.name}
                      className="group overflow-hidden border-[var(--border-light)] bg-white/95 p-0 transition-[transform,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:bg-white hover:shadow-[0_22px_50px_rgba(0,0,0,0.22)]"
                    >
                      <div className="relative h-[195px] w-full overflow-hidden bg-white">
                        <Image
                          src={vehicle.image}
                          unoptimized
                          alt={vehicle.name}
                          fill
                          className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/[0.03]" />
                      </div>

                      <div className="p-6">
                        <h3 className="font-[var(--font-display)] text-[20px] font-semibold text-[var(--green-dark)]">
                          {vehicle.name}
                        </h3>

                        <div className="mt-3 flex items-center gap-5 text-[12px] text-[var(--text-secondary)]">
                          <div className="flex items-center gap-1.5">
                            <PersonIcon />
                            <span>{vehicle.passengers} Passengers</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <BagIcon />
                            <span>{vehicle.bags} Bags</span>
                          </div>
                        </div>

                        <Button
                          href={vehicle.href}
                          className="mt-6 w-full py-3 transition-all duration-500 group-hover:bg-[var(--green-dark)]"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="relative overflow-hidden bg-white py-20 md:py-24">
          <DecorativePattern position="bottom-right" />

          <div className="relative z-10 mx-auto w-full max-w-[1080px] px-8 md:px-10">
            <ScrollReveal>
              <div className="mx-auto max-w-[720px] text-center">
                <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.28em] text-[var(--green-primary)]">
                  The Green Holiday Difference
                </p>

                <h2 className="font-[var(--font-display)] text-[36px] font-semibold leading-[1.2] text-[var(--green-dark)] md:text-[42px]">
                  More than a journey.
                </h2>

                <p className="mt-5 text-[14px] leading-7 text-[var(--text-secondary)]">
                  Thoughtful service, experienced people, and dependable
                  transportation — all working together to make your time in
                  Sri Lanka truly memorable.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="mt-10 space-y-4">
                <FeatureItem
                  icon={<DriverIcon />}
                  title="Professional Drivers"
                  description="Meticulously vetted, courteous, and knowledgeable English-speaking tourist driver-guides who know the island beyond the usual routes."
                />

                <FeatureItem
                  icon={<ShieldIcon />}
                  title="Safe & Comfortable"
                  description="Modern, well-maintained vehicles with air conditioning, onboard water, and clean, comfortable interiors."
                />

                <FeatureItem
                  icon={<PriceIcon />}
                  title="Transparent Pricing"
                  description="Clear and competitive rates designed to give you confidence from the beginning, with no unexpected charges."
                />

                <FeatureItem
                  icon={<ClockIcon />}
                  title="24/7 Dedicated Support"
                  description="Our team remains available throughout your journey to assist with schedule changes, questions, or unexpected situations."
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative min-h-[440px] overflow-hidden">
          <Image
            src="/images/sri-lanka-cta2.jpg"
            alt="Scenic Sri Lankan landscape"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,31,20,0.84)_0%,rgba(5,31,20,0.68)_45%,rgba(5,31,20,0.42)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[440px] w-full max-w-[1000px] items-center justify-center px-8 py-20 text-center">
            <ScrollReveal>
              <div className="max-w-[700px]">
                <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-white/75">
                  Your Sri Lankan Journey Awaits
                </p>

                <h2 className="mt-5 font-[var(--font-display)] text-[38px] font-semibold leading-[1.2] !text-white md:text-[48px]">
                  Let us take care of the journey.
                </h2>

                <p className="mx-auto mt-8 max-w-[590px] text-[13px] leading-7 text-white/80">
                  Choose your vehicle, tell us where you want to go, and let
                  our experienced team take care of the rest.
                </p>

                <div className="mt-9 flex justify-center">
                  <Link
                    href="/customer/booking"
                    className="group inline-flex items-center gap-4 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] !text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white/50 hover:bg-white hover:!text-[var(--green-dark)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.25)]"
                  >
                    <span>Start Your Journey</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current text-[13px] transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M6 19c0-3 2.5-5 6-5s6 2 6 5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="7" width="12" height="12" rx="2" />
      <path d="M9 7V5h6v2" />
    </svg>
  );
}

function DriverIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19c0-3 2-5 5-5s5 2 5 5" />
      <path d="M16 8h4" />
      <path d="M18 6v4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
      <path d="M9.5 12l1.7 1.7L15 10" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10" />
      <path d="M15 9c-.6-.7-1.5-1-2.6-1-1.4 0-2.4.7-2.4 1.8 0 2.8 5 1.3 5 4 0 1.2-1 2-2.6 2-1.1 0-2-.4-2.7-1.2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}