import type { ReactNode } from "react";

interface ContactInfoItemProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export default function ContactInfoItem({
  icon,
  label,
  value,
}: ContactInfoItemProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Contact icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-light)] bg-white text-[var(--green-primary)]">
        {icon}
      </div>

      {/* Contact information */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-primary)]">
          {label}
        </p>

        <div className="mt-1 text-sm font-semibold text-[var(--green-dark)]">
          {value}
        </div>
      </div>
    </div>
  );
}