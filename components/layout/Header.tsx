"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/common/logo";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "VEHICLES", href: "/customer/vehicles" },
  { label: "HOW IT WORKS", href: "/customer/booking" },
  { label: "FEEDBACKS", href: "/customer/feedback" },
  { label: "CONTACT US", href: "/customer/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 80 || currentY < previousY) {
        setVisible(true);
      } else if (currentY > previousY) {
        setVisible(false);
        setMenuOpen(false);
      }

      previousY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Keeps page content from jumping when the fixed header moves */}
      <div className="h-[88px]" />

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--green-dark)] transition-transform duration-300 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto grid h-[88px] w-full max-w-[1280px] grid-cols-[1fr_auto] items-center px-5 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          <div className="flex justify-start">
            <Logo
              size="medium"
              variant="white"
              priority
              className="shrink-0"
            />
          </div>

          {/* Desktop navigation */}
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
                  {active && (
                    <span className="absolute bottom-[18px] left-1/2 h-[2px] w-[18px] -translate-x-1/2 rounded-full bg-[var(--green-light)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end">
            <a
              href="tel:+94771234567"
              className="hidden whitespace-nowrap rounded-md bg-[var(--green-primary)] px-5 py-3 text-[13px] font-bold !text-white transition-colors hover:bg-[var(--green-deep)] lg:inline-flex"
            >
              Bookings: +94 77 123 4567
            </a>

            {/* Mobile three dash button */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] text-white lg:hidden"
            >
              <span className="h-[2px] w-6 bg-current" />
              <span className="h-[2px] w-6 bg-current" />
              <span className="h-[2px] w-6 bg-current" />
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="flex flex-col border-t border-white/10 px-5 pb-5 lg:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 text-sm font-semibold ${
                  isActive(item.href)
                    ? "!text-[var(--green-light)]"
                    : "!text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <a
              href="tel:+94771234567"
              className="mt-3 rounded-md bg-[var(--green-primary)] px-4 py-3 text-center text-sm font-bold !text-white"
            >
              Bookings: +94 77 123 4567
            </a>
          </nav>
        )}
      </header>
    </>
  );
}