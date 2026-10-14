"use client";

import Image from "next/image";
import Link from "next/link";

import Card from "@/components/ui/Card";

interface Service {
  title: string;
  description: string;
  image: string;
  href: string;
}

interface ServiceCardsProps {
  services: Service[];
}

export default function ServiceCards({
  services,
}: ServiceCardsProps) {
  return (
    <div className="group/services grid gap-7 md:grid-cols-3">
      {services.map((service) => (
        <Link
          key={service.title}
          href={service.href}
          className="
            group/card
            relative
            transition-all
            duration-500
            ease-out
            hover:z-20
            md:hover:scale-[1.05]
            md:group-hover/services:opacity-45
            md:hover:!opacity-100
          "
        >
          <Card
            className="
              h-full
              overflow-hidden
              border-[var(--border)]
              bg-white
              p-0
              transition-all
              duration-500
              ease-out
              group-hover/card:border-[var(--green-primary)]
              group-hover/card:shadow-[0_25px_60px_rgba(23,37,27,0.18)]
            "
          >
            {/* Service Image */}
            <div
              className="
                relative
                mx-3
                mt-3
                h-[205px]
                overflow-hidden
                rounded-[12px]
              "
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover/card:scale-[1.06]
                "
              />

              {/* Subtle image overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/20
                  to-transparent
                  opacity-60
                  transition-opacity
                  duration-500
                  group-hover/card:opacity-40
                "
              />
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6 pt-5">
              <h3
                style={{
                  fontFamily: "var(--font-nunito)",
                }}
                className="
                  text-center
                  text-[19px]
                  font-bold
                  uppercase
                  tracking-[0.06em]
                  text-[var(--green-dark)]
                "
              >
                {service.title}
              </h3>

              <p
                className="
                  mt-4
                  text-center
                  text-[13px]
                  font-normal
                  leading-6
                  text-[var(--text-secondary)]
                "
              >
                {service.description}
              </p>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--green-primary)]
                "
              >
                Discover

                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover/card:translate-x-1
                  "
                >
                  →
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}