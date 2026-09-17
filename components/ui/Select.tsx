import type { SelectHTMLAttributes } from "react";

// Shape of each select option
interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export default function Select({
  label,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {/* Optional field label */}
      {label && (
        <label className="mb-2 block text-[13px] font-semibold text-[var(--text-primary)]">
          {label}
        </label>
      )}

      {/* Reusable dropdown */}
      <select
        {...props}
        className={`h-[48px] w-full rounded-md border border-[var(--border-light)] bg-white px-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--green-primary)] ${className}`}
      >
        {/* Default option */}
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {/* Dynamic options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}