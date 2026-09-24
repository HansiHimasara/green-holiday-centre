"use client";

import Link from "next/link";
import type { ReactNode } from "react";

// Available button styles
type ButtonVariant = "primary" | "outline";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
}: ButtonProps) {
  // Base styles used by every button
  const base =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-[13px] font-semibold transition-colors";

  // Button styles
  const variants = {
    primary:
      "bg-[var(--green-primary)] !text-white hover:bg-[var(--green-dark)]",

    outline:
      "border border-[var(--green-primary)] bg-white text-[var(--green-primary)] hover:bg-[#F5F7F5]",
  };

  const disabledStyle = disabled
    ? "cursor-not-allowed opacity-60"
    : "";

  const classes = `${base} ${variants[variant]} ${disabledStyle} ${className}`;

  // Render a disabled link as text
  if (href && disabled) {
    return (
      <span
        className={classes}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  // Render as a link
  if (href) {
    return (
      <Link
        href={href}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  // Render as a normal button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}