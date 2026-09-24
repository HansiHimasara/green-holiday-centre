"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/common/logo";
import PageTitle from "@/components/common/PageTitle";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type PageMode =
  | "login"
  | "forgot"
  | "change"
  | "reset";

export default function AdminLoginPage() {
  const router = useRouter();

  const [mode, setMode] =
    useState<PageMode>("login");

  const [resetToken, setResetToken] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  // Check whether the user opened a password reset link
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("reset");

    if (token) {
      setResetToken(token);
      setMode("reset");
    }
  }, []);

  // Admin login
  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData =
        new FormData(
          event.currentTarget
        );

      const email =
        String(
          formData.get("email") ?? ""
        ).trim();

      const password =
        String(
          formData.get("password") ?? ""
        );

      const remember =
        formData.get("remember") === "on";

      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
              remember,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to login."
        );

        return;
      }

      router.replace(
        "/admin/dashboard"
      );
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Send password reset email
  async function handlePasswordResetRequest(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData =
        new FormData(
          event.currentTarget
        );

      const email =
        String(
          formData.get("email") ?? ""
        ).trim();

      const response =
        await fetch(
          "/api/auth/password-reset/request",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to send reset email."
        );

        return;
      }

      setMessage(
        data.message ||
          "Password reset link sent. Please check your email."
      );
    } catch (error) {
      console.error(
        "Password reset request error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Save the new password
  async function handleResetPassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData =
        new FormData(
          event.currentTarget
        );

      const password =
        String(
          formData.get("password") ?? ""
        );

      const confirmPassword =
        String(
          formData.get(
            "confirmPassword"
          ) ?? ""
        );

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      const response =
        await fetch(
          "/api/auth/password-reset/confirm",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              token: resetToken,
              password,
              confirmPassword,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to reset password."
        );

        return;
      }

      setMessage(
        "Password changed successfully. You can now log in."
      );

      setMode("login");

      window.history.replaceState(
        {},
        "",
        "/admin/login"
      );
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function goBackToLogin() {
    setMode("login");
    setError("");
    setMessage("");
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#F8F7F1]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[var(--green-primary)]/[0.04]" />

      <div className="pointer-events-none absolute bottom-[-150px] left-[-120px] h-[320px] w-[320px] rounded-full bg-[var(--sky-blue)]/[0.04]" />

      {/* Back to website */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-6 md:px-10 md:pt-7">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--green-primary)]"
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
            <path d="m12 19-7-7 7-7" />
          </svg>

          Back to Website
        </Link>
      </div>

      {/* Login area */}
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

          {/* Admin label */}
          <div className="mb-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-[var(--green-primary)]/15 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--green-primary)]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-dark)]">
                Administration Portal
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_18px_50px_rgba(7,91,69,0.08)]">
            <div className="flex h-1.5 w-full">
              <span className="flex-1 bg-[var(--green-primary)]" />
              <span className="flex-1 bg-[var(--yellow-golden)]" />
              <span className="flex-1 bg-[var(--sky-blue)]" />
            </div>

            <div className="px-7 py-8 md:px-9 md:py-9">
              {/* Login form */}
              {mode === "login" && (
                <>
                  <div className="mb-7">
                    <PageTitle
                      title="Admin Login"
                      description="Sign in to manage bookings, vehicles, customers, and other system activities."
                    />
                  </div>

                  {error && (
                    <ErrorMessage
                      message={error}
                    />
                  )}

                  {message && (
                    <SuccessMessage
                      message={message}
                    />
                  )}

                  <form
                    onSubmit={
                      handleLogin
                    }
                    className="space-y-5"
                  >
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      placeholder="admin@greenholiday.lk"
                      autoComplete="email"
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />

                    <div className="flex items-center justify-between gap-4 pt-1 text-sm">
                      <label className="flex cursor-pointer items-center gap-2 text-[var(--text-secondary)]">
                        <input
                          type="checkbox"
                          name="remember"
                          className="h-4 w-4 accent-[var(--green-primary)]"
                        />

                        Remember Me
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setMode(
                            "forgot"
                          );
                          setError("");
                          setMessage("");
                        }}
                        className="font-semibold text-[var(--green-primary)] transition-colors duration-200 hover:text-[var(--green-dark)]"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        loading
                      }
                      className="mt-2 w-full !bg-[var(--green-dark)] !text-white hover:!bg-[var(--green-forest)]"
                    >
                      {loading
                        ? "Logging In..."
                        : "Log In"}
                    </Button>
                  </form>

                  {/* Change password */}
                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode(
                          "change"
                        );
                        setError("");
                        setMessage("");
                      }}
                      className="text-sm font-semibold text-[var(--green-primary)] hover:text-[var(--green-dark)]"
                    >
                      Change Password
                    </button>
                  </div>
                </>
              )}

              {/* Forgot or change password */}
              {(mode === "forgot" ||
                mode ===
                  "change") && (
                <>
                  <div className="mb-7">
                    <PageTitle
                      title={
                        mode ===
                        "forgot"
                          ? "Forgot Password"
                          : "Change Password"
                      }
                      description="Enter your administrator email address and we will send you a secure password reset link."
                    />
                  </div>

                  {error && (
                    <ErrorMessage
                      message={error}
                    />
                  )}

                  {message && (
                    <SuccessMessage
                      message={message}
                    />
                  )}

                  <form
                    onSubmit={
                      handlePasswordResetRequest
                    }
                    className="space-y-5"
                  >
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      placeholder="admin@greenholiday.lk"
                      autoComplete="email"
                      required
                    />

                    <Button
                      type="submit"
                      disabled={
                        loading
                      }
                      className="w-full !bg-[var(--green-dark)] !text-white hover:!bg-[var(--green-forest)]"
                    >
                      {loading
                        ? "Sending..."
                        : "Send Reset Link"}
                    </Button>

                    <button
                      type="button"
                      onClick={
                        goBackToLogin
                      }
                      className="w-full text-sm font-semibold text-[var(--green-primary)] hover:text-[var(--green-dark)]"
                    >
                      Back to Login
                    </button>
                  </form>
                </>
              )}

              {/* Reset password */}
              {mode === "reset" && (
                <>
                  <div className="mb-7">
                    <PageTitle
                      title="Create New Password"
                      description="Enter and confirm your new administrator password."
                    />
                  </div>

                  {error && (
                    <ErrorMessage
                      message={error}
                    />
                  )}

                  <form
                    onSubmit={
                      handleResetPassword
                    }
                    className="space-y-5"
                  >
                    <Input
                      label="New Password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />

                    <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                      Password must
                      contain at least
                      8 characters.
                    </p>

                    <Button
                      type="submit"
                      disabled={
                        loading
                      }
                      className="w-full !bg-[var(--green-dark)] !text-white hover:!bg-[var(--green-forest)]"
                    >
                      {loading
                        ? "Changing Password..."
                        : "Change Password"}
                    </Button>
                  </form>
                </>
              )}

              {/* Security note for users */}
              <div className="mt-6 rounded-lg border border-[var(--green-primary)]/10 bg-[var(--surface-soft)] px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)] text-[10px] font-bold text-white">
                    ✓
                  </div>

                  <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                    This area is
                    restricted to
                    authorised Green
                    Holiday
                    administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* No public sign up */}
          <p className="mt-7 text-center text-xs text-[var(--text-secondary)]">
            Administrator accounts
            are created by the Super
            Admin.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-light)] bg-white/70 px-6 py-5 text-center">
        <p className="text-[11px] text-[var(--text-secondary)]">
          © 2026 Green Holiday
          (Pvt) Ltd. All Rights
          Reserved. Private Transport
          & Tours Service.
        </p>
      </footer>
    </main>
  );
}

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function SuccessMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {message}
    </div>
  );
}