"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/common/logo";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "VEHICLES", href: "/customer/vehicles" },
  { label: "HOW IT WORKS", href: "/customer/booking/airport-transfer" },
  { label: "FEEDBACKS", href: "/customer/feedback" },
  { label: "CONTACT US", href: "/customer/contact" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/booking/airport-transfer") {
      return pathname.startsWith("/booking");
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="w-full border-b border-[var(--border-light)] bg-white">
      <div className="mx-auto grid h-[88px] w-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-10">
        {/* Left - Logo */}
        <div className="flex justify-start">
          <Logo
            size="small"
            priority
            className="shrink-0"
          />
        </div>

        {/* Center - Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-8 text-[13px] font-semibold transition-colors ${
                  active
                    ? "text-[var(--green-primary)]"
                    : "text-[var(--text-primary)] hover:text-[var(--green-primary)]"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute bottom-[18px] left-1/2 h-[2px] w-[18px] -translate-x-1/2 rounded-full bg-[var(--green-primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right - Login + Booking */}
        <div className="flex items-center justify-end gap-4">
          {/* Login Icon */}
          <div className="group relative">
            <Link
              href="/customer/login"
              aria-label="Login"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#17251B] transition-all duration-200 hover:bg-[#F5F7F5] hover:text-[var(--green-primary)]"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:scale-110"
              >
                <circle cx="8.5" cy="11" r="3.5" />
                <path d="M11.5 11H21" />
                <path d="M17 11v3" />
                <path d="M20 11v2" />
              </svg>
            </Link>

            {/* Tooltip */}
            <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#17251B] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-all duration-200 group-hover:translate-y-1 group-hover:opacity-100">
              Login
            </span>
          </div>

          {/* Booking Number */}
          <a
            href="tel:+94771234567"
            className="hidden whitespace-nowrap rounded-md bg-[var(--green-dark)] px-5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-[var(--green-deep)] sm:inline-flex"
          >
            Bookings: +94 77 123 4567
          </a>
        </div>
      </div>
    </header>
  );
}