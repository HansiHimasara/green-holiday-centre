interface SummaryRowProps {
  label: string;
  value: string;
}

export default function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div className="grid grid-cols-[200px_1fr] border-b border-[var(--border-light)] py-4 text-sm">
      {/* Summary field title */}
      <span className="font-semibold text-gray-500">
        {label}
      </span>

      {/* Summary field value */}
      <span className="font-medium text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}