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
      className={`overflow-hidden rounded-xl border border-gray-100 bg-white p-6 ${className}`}
    >
      <div className="overflow-x-auto">
        <table
          className="
            w-full
            border-collapse
            text-left
            text-sm

            [&_thead_tr]:border-b
            [&_thead_tr]:border-gray-100

            [&_tbody_tr]:border-b
            [&_tbody_tr]:border-gray-100
            [&_tbody_tr:last-child]:border-b-0

            [&_tbody_tr:nth-child(odd)]:bg-[#FAFAF8]
            [&_tbody_tr:nth-child(even)]:bg-white

            [&_tbody_tr]:transition-colors
            [&_tbody_tr:hover]:bg-[#F5F8F3]
          "
        >
          {children}
        </table>
      </div>
    </div>
  );
}