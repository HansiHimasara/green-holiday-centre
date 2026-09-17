import type { ReactNode } from "react";

// Different badge styles
type BadgeVariant = "success" | "soft";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "soft",
  className = "",
}: BadgeProps) {
  const variants = {
    success:
      "border border-[var(--green-primary)] bg-white text-[var(--green-primary)]",

    soft:
      "bg-[#F1F6F1] text-[var(--green-primary)]",
  };

  return (
    <span
      className={`inline-flex rounded-md px-3 py-1 text-[11px] font-bold uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}