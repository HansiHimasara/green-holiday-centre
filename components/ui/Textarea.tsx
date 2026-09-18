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
      {label && (
        <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className={`min-h-[92px] w-full resize-none rounded-md border border-[#DDE4DE] bg-white px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[#7D8981] focus:border-[var(--green-primary)] ${className}`}
      />
    </div>
  );
}