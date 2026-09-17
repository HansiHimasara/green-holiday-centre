import type { ReactNode } from "react";

interface BookingFieldProps {
  label: string;
  children: ReactNode;
}

export default function BookingField({
  label,
  children,
}: BookingFieldProps) {
  return (
    <div>
      {/* Field label */}
      <label className="mb-2 block text-[13px] font-semibold text-[var(--text-primary)]">
        {label}
      </label>

      {/* Input, select or textarea goes here */}
      {children}
    </div>
  );
}