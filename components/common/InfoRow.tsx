interface InfoRowProps {
  label: string;
  value: string;
}

export default function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-light)] py-3 text-sm">
      <span className="font-medium text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}