import type { ReactNode } from "react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
}

export default function AdminStatCard({
  title,
  value,
  icon,
  subtitle,
}: AdminStatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-secondary)]">
            {title}
          </p>

          <h3 className="mt-2 text-[26px] font-bold text-[var(--green-dark)]">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEF7E9] text-[var(--green-primary)]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}