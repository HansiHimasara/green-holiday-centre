import Link from "next/link";

type ServiceType =
  | "airport-transfer"
  | "day-tour"
  | "round-tour";

interface ServiceTabsProps {
  active: ServiceType;
}

const tabs: {
  label: string;
  value: ServiceType;
  href: string;
}[] = [
  {
    label: "Airport Transfers",
    value: "airport-transfer",
    href: "/customer/booking/airport-transfer",
  },
  {
    label: "Day Tours",
    value: "day-tour",
    href: "/customer/booking/day-tour",
  },
  {
    label: "Round Tours",
    value: "round-tour",
    href: "/customer/booking/round-tour",
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
            className={`rounded-md border px-5 py-2.5 text-[13px] font-semibold transition-colors ${
              isActive
                ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-white"
                : "border-[var(--border-light)] bg-white text-[var(--text-secondary)] hover:border-[var(--green-primary)] hover:text-[var(--green-primary)]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}