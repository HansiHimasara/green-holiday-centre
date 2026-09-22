import Link from "next/link";

import Logo from "@/components/common/logo";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminSignUpPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#F8F7F1]">
      {/* ==========================================
          SUBTLE BACKGROUND ACCENTS
      ========================================== */}
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[var(--green-primary)]/[0.04]" />

      <div className="pointer-events-none absolute bottom-[-150px] left-[-120px] h-[320px] w-[320px] rounded-full bg-[var(--sky-blue)]/[0.04]" />

      {/* ==========================================
          TOP NAVIGATION
      ========================================== */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-6 md:px-10 md:pt-7">
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-[var(--text-secondary)]
            transition-colors
            duration-200
            hover:text-[var(--green-primary)]
          "
        >
          {/* Back Arrow */}
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>

          Back to Website
        </Link>
      </div>

      {/* ==========================================
          SIGN UP AREA
      ========================================== */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 md:py-14">
        <div className="w-full max-w-[500px]">
          {/* Logo */}
          <div className="mb-7 flex justify-center">
            <Logo
              size="large"
              variant="green"
              priority
            />
          </div>

          {/* Admin Label */}
          <div className="mb-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-[var(--green-primary)]/15 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--green-primary)]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-dark)]">
                Administration Portal
              </span>
            </div>
          </div>

          {/* ==========================================
              SIGN UP CARD
          ========================================== */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_18px_50px_rgba(7,91,69,0.08)]">
            {/* Colour Accent */}
            <div className="flex h-1.5 w-full">
              <span className="flex-1 bg-[var(--green-primary)]" />
              <span className="flex-1 bg-[var(--yellow-golden)]" />
              <span className="flex-1 bg-[var(--sky-blue)]" />
            </div>

            <div className="px-7 py-8 md:px-9 md:py-9">
              {/* Heading */}
              <div className="text-center">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--green-primary)]">
                  Administrator Registration
                </p>

                <h1 className="mt-2 font-[var(--font-display)] text-[30px] font-semibold leading-tight text-[var(--green-dark)]">
                  Create Admin Account
                </h1>

                <p className="mx-auto mt-2 max-w-[390px] text-[13px] leading-6 text-[var(--text-secondary)]">
                  Create an authorised account to access and manage the Green
                  Holiday administration system.
                </p>
              </div>

              {/* Form */}
              <form className="mt-7 space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="admin@greenholiday.lk"
                  autoComplete="email"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-type your password"
                  autoComplete="new-password"
                />

                {/* Create Account */}
                <Button
                  type="submit"
                  className="
                    mt-2
                    w-full
                    !bg-[var(--green-dark)]
                    !text-white
                    py-3.5
                    text-[13px]
                    font-extrabold
                    hover:!bg-[var(--green-forest)]
                  "
                >
                  Create Admin Account
                </Button>
              </form>

              {/* Security Note */}
              <div className="mt-6 rounded-lg border border-[var(--green-primary)]/10 bg-[var(--surface-soft)] px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)] text-[10px] font-bold text-white">
                    ✓
                  </div>

                  <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                    Administrator accounts should only be created for
                    authorised Green Holiday staff.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/admin/login"
              className="
                font-semibold
                text-[var(--green-primary)]
                transition-colors
                duration-200
                hover:text-[var(--green-dark)]
              "
            >
              Log In
            </Link>
          </p>
        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="relative z-10 border-t border-[var(--border-light)] bg-white/70 px-6 py-5 text-center">
        <p className="text-[11px] text-[var(--text-secondary)]">
          © 2026 Green Holiday (Pvt) Ltd. All Rights Reserved. Private
          Transport & Tours Service.
        </p>
      </footer>
    </main>
  );
}