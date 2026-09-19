import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import SectionTitle from "@/components/common/SectionTitle";
import FeatureItem from "@/components/home/FeatureItem";

const services = [
  {
    title: "Round Tours",
    description:
      "Comprehensive multi-day transport with dedicated professional English-speaking tourist drivers guide across the island.",
    image: "/images/ourservice1.png",
    href: "/customer/booking/round-tour",
  },
  {
    title: "Day Trips",
    description:
      "Curated single-day itineraries exploring UNESCO world heritage sites, tranquil beaches, tea plantations, and scenic viewpoints.",
    image: "/images/ourservice2.png",
    href: "/customer/booking/day-tour",
  },
  {
    title: "Airport Transfers",
    description:
      "Reliable and timely transfers to and from Bandaranaike International Airport (CMB) to any hotel or city destination in Sri Lanka.",
    image: "/images/ourservice3.png",
    href: "/customer/booking/airport-transfer",
  },
];

const featuredVehicles = [
  {
    name: "Premium Sedan",
    image: "/images/featuredvehicle1.png",
    passengers: 4,
    bags: 2,
    href: "/customer/vehicles/premium-sedan",
  },
  {
    name: "Executive Minivan",
    image: "/images/featuredvehicle2.png",
    passengers: 9,
    bags: 6,
    href: "/customer/vehicles/executive-minivan",
  },
  {
    name: "Luxury SUV",
    image: "/images/featuredvehicle3.png",
    passengers: 6,
    bags: 4,
    href: "/customer/vehicles/luxury-suv",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[535px] overflow-hidden">
          <Image
            src="/images/Hero Section.png"
            alt="Sigiriya landscape in Sri Lanka"
            fill
            priority
            className="object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 mx-auto flex min-h-[535px] w-full max-w-[1280px] items-center px-10">
            <div className="max-w-[820px]">
              {/* White hero heading */}
              <h1 className="max-w-[800px] font-serif text-[52px] leading-[1.12] font-medium !text-white">
                You Experience. We Make Travel Happen.
              </h1>

              <p className="mt-6 max-w-[700px] text-[16px] leading-7 text-white/90">
                Premium chauffeur-driven transport services tailored for your
                journey. Safe, reliable, and comfortable vehicles across the
                paradise island.
              </p>

              <div className="mt-8">
                {/* Light green button + dark green text */}
                <Button
                  href="/customer/vehicles"
                  className="bg-[var(--green-light)] px-7 py-4 !text-white hover:bg-[#7db633]"
                >
                  Book Your Vehicle
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-[1280px] px-10">
            <SectionTitle
              title="Our Services"
              subtitle="Professional transportation options designed for travelers and corporate guests"
            />

            <div className="mt-10 grid gap-7 md:grid-cols-3">
              {services.map((service) => (
                <Link key={service.title} href={service.href}>
                  <Card className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-[195px] w-full overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF7E9] text-[var(--green-primary)]">
                          <ServiceIcon />
                        </div>

                        <h3 className="font-serif text-[17px] font-semibold text-[var(--green-dark)]">
                          {service.title}
                        </h3>
                      </div>

                      <p className="mt-4 text-[13px] leading-6 text-[var(--text-secondary)]">
                        {service.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="bg-[var(--surface)] py-16">
          <div className="mx-auto w-full max-w-[1280px] px-10">
            <SectionTitle
              title="Featured Vehicles"
              subtitle="Choose from our premium fleet of meticulously maintained vehicles"
            />

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {featuredVehicles.map((vehicle) => (
                <Card
                  key={vehicle.name}
                  className="overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-[185px] w-full overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-[18px] font-semibold text-[var(--green-dark)]">
                      {vehicle.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-5 text-[12px] text-[var(--text-secondary)]">
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
                      className="mt-5 w-full py-3"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-[1080px] px-10">
            <SectionTitle
              title="Why Choose Us?"
              subtitle="The premier private transportation company choice for discerning global travelers"
            />

            <div className="mt-10 space-y-6">
              <FeatureItem
                icon={<DriverIcon />}
                title="Professional Drivers"
                description="Meticulously vetted, courteous, and highly knowledgeable tourist driver-guides fluent in English."
              />

              <FeatureItem
                icon={<ShieldIcon />}
                title="Safe & Comfortable"
                description="Top-tier safety-rated modern vehicles equipped with air conditioning, onboard water, and clean interiors."
              />

              <FeatureItem
                icon={<PriceIcon />}
                title="Best Prices Guaranteed"
                description="Completely transparent and highly competitive rates with absolute zero hidden taxes or surprise charges."
              />

              <FeatureItem
                icon={<ClockIcon />}
                title="24/7 Dedicated Support"
                description="Our customer service desk remains operational around the clock to support schedule updates or emergency changes."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* Icons */

function ServiceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </svg>
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