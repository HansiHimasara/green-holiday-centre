import type { ReactNode } from "react";

interface VehicleSpecProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function VehicleSpec({
  icon,
  label,
  value,
}: VehicleSpecProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Icon box */}
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F3F7F3] text-[var(--green-primary)]">
        {icon}
      </div>

      {/* Specification information */}
      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="font-semibold text-[var(--text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
}