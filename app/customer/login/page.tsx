import Link from "next/link";

import Logo from "@/components/common/logo";
import PageTitle from "@/components/common/PageTitle";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Top Back Link */}
      <div className="mx-auto w-full max-w-[1280px] px-10 pt-7">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--green-primary)]"
        >
          {/* Back Arrow Icon */}
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

      {/* Main Login Area */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[500px]">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <Logo
              size="large"
              variant="green"
              priority
            />
          </div>

          {/* Login Card */}
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-10 py-10">
            {/* Title */}
            <div className="mb-8">
              <PageTitle title="Admin Login" />
            </div>

            {/* Login Form */}
            <form className="space-y-6">
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
              <div className="flex items-center justify-between text-sm">
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
                  className="font-semibold text-[var(--green-primary)] transition-colors hover:text-[var(--green-dark)]"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full"
              >
                Log In
              </Button>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="mt-10 text-center text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/admin/register"
              className="font-semibold text-[var(--green-primary)] transition-colors hover:text-[var(--green-dark)]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Footer Text */}
      <footer className="border-t border-[var(--border-light)] bg-[var(--surface)] px-6 py-7 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          © 2026 Green Holiday (Pvt) Ltd. All Rights Reserved. Private
          Transport & Tours Service.
        </p>
      </footer>
    </main>
  );
}
