interface AdminSearchBarProps {
  placeholder?: string;
}

export default function AdminSearchBar({
  placeholder = "Search...",
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
        placeholder={placeholder}
        className="h-[42px] w-full rounded-lg border border-[var(--border-light)] bg-white pl-11 pr-4 text-sm outline-none focus:border-[var(--green-primary)]"
      />
    </div>
  );
}