import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--border-light)] bg-white p-7 ${className}`}
    >
      {children}
    </div>
  );
}