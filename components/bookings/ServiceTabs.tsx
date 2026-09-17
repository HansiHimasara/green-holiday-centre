import Link from "next/link";

type ServiceType =
  | "airport-transfer"
  | "day-tour"
  | "round-tour";

interface ServiceTabsProps {
  active: ServiceType;
}

// Booking service tabs and their routes
const tabs = [
  {
    label: "Airport Transfers",
    value: "airport-transfer",
    href: "/booking/airport-transfer",
  },
  {
    label: "Day Tours",
    value: "day-tour",
    href: "/booking/day-tour",
  },
  {
    label: "Round Tours",
    value: "round-tour",
    href: "/booking/round-tour",
  },
];

export default function ServiceTabs({
  active,
}: ServiceTabsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {tabs.map((tab) => {
        const isActive = active === tab.value;

        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`rounded-md border px-6 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-white"
                : "border-[var(--border-light)] bg-white text-gray-500 hover:border-[var(--green-primary)] hover:text-[var(--green-primary)]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}