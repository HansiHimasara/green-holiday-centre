import type { InputHTMLAttributes } from "react";

// Extends normal HTML input properties
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({
  label,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {/* Optional field label */}
      {label && (
        <label className="mb-2 block text-[13px] font-semibold text-[var(--text-primary)]">
          {label}
        </label>
      )}

      {/* Reusable text input */}
      <input
        {...props}
        className={`h-[48px] w-full rounded-md border border-[var(--border-light)] bg-white px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-gray-400 focus:border-[var(--green-primary)] ${className}`}
      />
    </div>
  );
}