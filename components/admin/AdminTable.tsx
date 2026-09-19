import type { ReactNode } from "react";

interface AdminTableProps {
  children: ReactNode;
  className?: string;
}

export default function AdminTable({
  children,
  className = "",
}: AdminTableProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--border-light)] bg-white p-6 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}