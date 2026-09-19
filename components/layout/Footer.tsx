import Link from "next/link";
import Logo from "@/components/common/logo";

export default function Footer() {
  return (
    <footer className="bg-[var(--green-deep)] text-white/75">
      <div className="mx-auto w-full max-w-[1280px] px-10 pb-5 pt-10">
        {/* Main Footer */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr] lg:gap-16">
          {/* Company */}
          <div>
            <Logo
              size="small"
              variant="white"
              className="mb-5"
            />

            <p className="max-w-[360px] text-sm leading-6 text-white/75">
              Premium luxury transportation and customized private tours
              across Sri Lanka. Experience the teardrop island in
              unparalleled comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.08em] text-[var(--green-light)]">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/vehicles">Vehicles</FooterLink>
              <FooterLink href="/booking/airport-transfer">
                How It Works
              </FooterLink>
              <FooterLink href="/feedback">Feedbacks</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.08em] text-[var(--green-light)]">
              Our Services
            </h3>

            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink href="/booking/airport-transfer">
                Airport Transfers
              </FooterLink>

              <FooterLink href="/booking/day-tour">
                Day Trips
              </FooterLink>

              <FooterLink href="/booking/round-tour">
                Round Tours
              </FooterLink>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.08em] text-[var(--green-light)]">
              Contact Details
            </h3>

            <div className="space-y-2.5 text-sm">
              <p>42 Galle Road, Colombo 03, Sri Lanka</p>

              <a
                href="mailto:info@greenholiday.lk"
                className="transition-colors hover:text-white"
              >
                info@greenholiday.lk
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            © 2026 Green Holiday (Pvt) Ltd. All Rights Reserved.
          </p>

          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({
  href,
  children,
}: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

function SocialIcons() {
  return (
    <div className="flex items-center gap-3">
      {/* Facebook */}
      <a
        href="#"
        aria-label="Facebook"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13.5 22v-9h3l.45-3.5H13.5V7.26c0-1.01.28-1.7 1.73-1.7H17V2.14C16.69 2.1 15.63 2 14.38 2 11.78 2 10 3.59 10 6.51V9.5H7V13h3v9h3.5Z" />
        </svg>
      </a>

      {/* Instagram */}
      <a
        href="#"
        aria-label="Instagram"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            ry="5"
          />

          <circle
            cx="12"
            cy="12"
            r="4"
          />

          <circle
            cx="17.5"
            cy="6.5"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      </a>

      {/* X / Twitter */}
      <a
        href="#"
        aria-label="X"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.9 2H22l-6.77 7.74L23 22h-6.09l-4.77-6.24L6.68 22H3.56l7.13-8.15L3.23 2h6.24l4.31 5.7L18.9 2Zm-1.09 17.84h1.72L8.54 4.05H6.69l11.12 15.79Z" />
        </svg>
      </a>
    </div>
  );
}