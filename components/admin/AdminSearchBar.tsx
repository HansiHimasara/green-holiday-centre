import type { ChangeEvent } from "react";

interface AdminSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function AdminSearchBar({
  placeholder = "Search...",
  value,
  onChange,
}: AdminSearchBarProps) {
  return (
    <div className="relative w-full max-w-[360px]">
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          h-[42px]
          w-full
          rounded-lg
          border
          border-[var(--border-light)]
          bg-white
          pl-11
          pr-4
          text-sm
          outline-none
          transition-colors
          duration-200
          focus:border-[var(--green-primary)]
          focus:ring-2
          focus:ring-[var(--green-primary)]/10
        "
      />
    </div>
  );
}