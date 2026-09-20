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
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const isActive = active === tab.value;

        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`
              group relative overflow-hidden
              rounded-md
              border
              px-6 py-3
              text-[12px]
              font-extrabold
              uppercase
              tracking-[0.12em]
              transition-all
              duration-300
              ease-out

              ${
                isActive
                  ? `
                    border-[var(--green-dark)]
                    bg-[var(--green-dark)]
                    !text-white
                    translate-y-[-2px]
                    shadow-[0_6px_0_var(--green-forest),0_10px_20px_rgba(7,91,69,0.20)]
                  `
                  : `
                    border-[var(--green-leaf)]/40
                    bg-white
                    text-[var(--green-forest)]
                    shadow-sm
                    hover:-translate-y-1
                    hover:border-[var(--green-primary)]
                    hover:bg-[var(--green-primary)]
                    hover:!text-white
                    hover:shadow-[0_5px_0_var(--green-forest),0_8px_16px_rgba(7,91,69,0.15)]
                  `
              }
            `}
          >
            {/* Soft animated highlight */}
            {isActive && (
              <span
                className="
                  pointer-events-none
                  absolute inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/15
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />
            )}

            <span className="relative z-10">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}