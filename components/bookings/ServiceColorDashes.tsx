"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ServiceColorDashesProps {
  active: "airport-transfer" | "day-tour" | "round-tour";
}

const services = [
  {
    key: "airport-transfer" as const,
    href: "/customer/booking/airport-transfer",
  },
  {
    key: "day-tour" as const,
    href: "/customer/booking/day-tour",
  },
  {
    key: "round-tour" as const,
    href: "/customer/booking/round-tour",
  },
];

export default function ServiceColorDashes({
  active,
}: ServiceColorDashesProps) {
  const pathname = usePathname();

  const getWidth = (
    service: "airport-transfer" | "day-tour" | "round-tour",
    color: "green" | "yellow" | "blue"
  ) => {
    if (service === "airport-transfer") {
      if (color === "green") return "w-10";
      if (color === "yellow") return "w-5";
      return "w-3";
    }

    if (service === "day-tour") {
      if (color === "green") return "w-3";
      if (color === "yellow") return "w-10";
      return "w-5";
    }

    if (color === "green") return "w-5";
    if (color === "yellow") return "w-3";
    return "w-10";
  };

  return (
    <div className="mx-auto mt-7 flex w-fit items-center gap-2">
      {services.map((service) => {
        const isActive =
          active === service.key || pathname === service.href;

        return (
          <Link
            key={service.key}
            href={service.href}
            aria-label={`Go to ${service.key.replace("-", " ")}`}
            className="flex items-center"
          >
            <span
              className={`
                h-1.5
                rounded-full
                transition-[width,opacity]
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                ${isActive ? "opacity-100" : "opacity-90"}
                ${
                  service.key === "airport-transfer"
                    ? "bg-[var(--green-primary)]"
                    : service.key === "day-tour"
                      ? "bg-[var(--yellow-golden)]"
                      : "bg-[var(--sky-blue)]"
                }
                ${getWidth(active, service.key === "airport-transfer"
                  ? "green"
                  : service.key === "day-tour"
                    ? "yellow"
                    : "blue")}
              `}
            />
          </Link>
        );
      })}
    </div>
  );
}