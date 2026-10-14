import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* Title + Description */}
      <div>
        <h1 className="font-serif text-[30px] font-semibold text-[var(--green-dark)]">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </div>

      {/* Optional right-side action */}
      {action && (
        <div className="flex shrink-0 items-center">
          {action}
        </div>
      )}
    </div>
  );
}