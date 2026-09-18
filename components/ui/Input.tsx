import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({
  label,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`h-[46px] w-full rounded-md border border-[#DDE4DE] bg-white px-4 text-[14px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[#7D8981] focus:border-[var(--green-primary)] ${className}`}
      />
    </div>
  );
}