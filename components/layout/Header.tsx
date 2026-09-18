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

    if (href === "/customer/booking/airport-transfer") {
      return pathname.startsWith("/customer/booking");
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="w-full border-b border-white/10 bg-[var(--green-dark)]">
      <div className="mx-auto grid h-[88px] w-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-10">
        
        {/* Left - Logo */}
        <div className="flex justify-start">
          <Logo
            size="medium"
            variant="white"
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
                    ? "!text-[var(--green-light)]"
                    : "!text-white hover:!text-[var(--green-light)]"
                }`}
              >
                {item.label}

                {/* Active underline */}
                {active && (
                  <span className="absolute bottom-[18px] left-1/2 h-[2px] w-[18px] -translate-x-1/2 rounded-full bg-[var(--green-light)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right - Booking Number */}
        <div className="flex items-center justify-end">
          <a
            href="tel:+94771234567"
            className="hidden whitespace-nowrap rounded-md bg-[var(--green-primary)] px-5 py-3 text-[13px] font-bold !text-white transition-colors hover:bg-[var(--green-deep)] sm:inline-flex"
          >
            Bookings: +94 77 123 4567
          </a>
        </div>
      </div>
    </header>
  );
}