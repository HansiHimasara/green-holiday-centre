import Link from "next/link";

import Logo from "@/components/common/logo";
import PageTitle from "@/components/common/PageTitle";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
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
          LOGIN AREA
      ========================================== */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-[460px]">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo
              size="large"
              variant="green"
              priority
            />
          </div>

          {/* Small Admin Label */}
          <div className="mb-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-[var(--green-primary)]/15 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--green-primary)]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-dark)]">
                Administration Portal
              </span>
            </div>
          </div>

          {/* Login Card */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_18px_50px_rgba(7,91,69,0.08)]">
            {/* Card Accent */}
            <div className="flex h-1.5 w-full">
              <span className="flex-1 bg-[var(--green-primary)]" />
              <span className="flex-1 bg-[var(--yellow-golden)]" />
              <span className="flex-1 bg-[var(--sky-blue)]" />
            </div>

            <div className="px-7 py-8 md:px-9 md:py-9">
              {/* Title */}
              <div className="mb-7">
                <PageTitle
                  title="Admin Login"
                  description="Sign in to manage bookings, vehicles, customers, and other system activities."
                />
              </div>

              {/* Login Form */}
              <form className="space-y-5">
                {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="admin@greenholiday.lk"
                  autoComplete="email"
                />

                {/* Password */}
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                {/* Remember + Forgot Password */}
                <div className="flex items-center justify-between gap-4 pt-1 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-[var(--text-secondary)]">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 accent-[var(--green-primary)]"
                    />

                    Remember Me
                  </label>

                  <Link
                    href="/admin/forgot-password"
                    className="
                      font-semibold
                      text-[var(--green-primary)]
                      transition-colors
                      duration-200
                      hover:text-[var(--green-dark)]
                    "
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="
                    mt-2
                    w-full
                    !bg-[var(--green-dark)]
                    !text-white
                    hover:!bg-[var(--green-forest)]
                  "
                >
                  Log In
                </Button>
              </form>

              {/* Security Note */}
              <div className="mt-6 rounded-lg border border-[var(--green-primary)]/10 bg-[var(--surface-soft)] px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)] text-[10px] font-bold text-white">
                    ✓
                  </div>

                  <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                    This area is restricted to authorised Green Holiday
                    administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-7 text-center text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/admin/register"
              className="
                font-semibold
                text-[var(--green-primary)]
                transition-colors
                duration-200
                hover:text-[var(--green-dark)]
              "
            >
              Sign Up
            </Link>
          </div>
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