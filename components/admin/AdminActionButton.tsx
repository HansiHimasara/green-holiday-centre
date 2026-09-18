import type { ReactNode } from "react";

interface AdminActionButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function AdminActionButton({
  children,
  variant = "outline",
  onClick,
  type = "button",
  className = "",
}: AdminActionButtonProps) {
  const variants = {
    primary:
      "bg-[var(--green-primary)] text-white hover:bg-[var(--green-dark)]",
    outline:
      "border border-[var(--border-light)] bg-white text-[var(--text-primary)] hover:bg-gray-50",
    danger:
      "border border-red-200 bg-white text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-[42px] items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}