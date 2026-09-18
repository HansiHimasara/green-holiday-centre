import Link from "next/link";

import Logo from "@/components/common/logo";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CustomerSignUpPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Back to Website */}
      <div className="mx-auto w-full max-w-[1280px] px-10 pt-7">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--green-primary)]"
        >
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
            <path d="M12 19l-7-7 7-7" />
          </svg>

          Back to Website
        </Link>
      </div>

      {/* Main Sign Up Area */}
      <div className="flex flex-1 flex-col items-center px-6 pb-12 pt-6">
        {/* Logo */}
        <Logo
          size="large"
          variant="green"
          priority
          className="mb-10"
        />

        {/* Sign Up Card */}
        <div className="w-full max-w-[500px] rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-10 py-10">
          <h1 className="text-center font-serif text-[28px] font-semibold text-[var(--green-dark)]">
            Create Admin Account
          </h1>

          <form className="mt-9 space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Enter your name here"
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email here"
              autoComplete="email"
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="Enter your phone number here"
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
              placeholder="Re-type password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="mt-2 w-full py-3.5 text-[15px]"
            >
              Sign Up
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-7 text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            href="/customer/login"
            className="font-semibold text-[var(--green-primary)] transition-colors hover:text-[var(--green-dark)]"
          >
            Log In
          </Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-light)] bg-[var(--surface)] py-8 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          © 2026 Green Holiday (Pvt) Ltd. All Rights Reserved. Private Transport
          & Tours Service.
        </p>
      </footer>
    </main>
  );
}