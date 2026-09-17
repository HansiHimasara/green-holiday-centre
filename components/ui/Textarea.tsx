import type { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({
  label,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {/* Optional label */}
      {label && (
        <label className="mb-2 block text-[13px] font-semibold text-[var(--text-primary)]">
          {label}
        </label>
      )}

      {/* Reusable textarea */}
      <textarea
        {...props}
        className={`min-h-[110px] w-full resize-none rounded-md border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-gray-400 focus:border-[var(--green-primary)] ${className}`}
      />
    </div>
  );
}