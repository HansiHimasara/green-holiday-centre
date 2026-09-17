export default function SecureBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded bg-[#F2F7F2] px-3 py-1.5 text-[11px] font-bold text-[var(--green-dark)]">
      {/* Shield icon */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>

      SECURE 256-BIT SSL ENCRYPTED TRANSACTION
    </div>
  );
}