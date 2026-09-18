import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
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
      {label && (
        <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`h-[46px] w-full rounded-md border border-[#DDE4DE] bg-white px-4 text-[14px] text-[var(--text-secondary)] outline-none transition-colors focus:border-[var(--green-primary)] ${className}`}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

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