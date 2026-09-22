"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import PageTitle from "@/components/common/PageTitle";
import StarRating from "@/components/feedback/StarRating";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import DecorativePattern from "@/components/ui/DecorativePattern";

export default function FeedbackPage() {
  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden bg-[#F8F7F1]">
        {/* ==========================================
            PAGE HEADER
        ========================================== */}
        <section className="relative overflow-hidden bg-white">
          {/* Decorative Circles */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[var(--yellow-golden)]/10" />

          <div className="pointer-events-none absolute -left-20 bottom-[-100px] h-60 w-60 rounded-full bg-[var(--sky-blue)]/8" />

          <div className="relative z-10 mx-auto w-full max-w-[850px] px-8 py-14 text-center md:px-10 md:py-16">
            <PageTitle
              eyebrow="Your Experience Matters"
              title="We Value Your Feedback"
              description="Your experience helps us improve our service and create better journeys for future travellers."
            />

            {/* Equal Colour Dashes */}
            <div className="mx-auto mt-7 flex w-fit items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-[var(--green-primary)]" />
              <span className="h-1.5 w-6 rounded-full bg-[var(--yellow-golden)]" />
              <span className="h-1.5 w-6 rounded-full bg-[var(--sky-blue)]" />
            </div>
          </div>
        </section>

        {/* ==========================================
            FEEDBACK FORM
        ========================================== */}
        <section className="relative z-10 py-10 md:py-12">
          <div className="mx-auto w-full max-w-[720px] px-6 md:px-8">
            {/* FORM CARD */}
            <div className="rounded-2xl border border-[var(--border-light)] bg-[#F8FAF7] p-7 shadow-[0_15px_45px_rgba(7,91,69,0.08)] md:p-8">
              <div className="space-y-5">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                />

                <Input
                  label="Booking Reference"
                  placeholder="e.g. GH-2026-0142"
                />

                {/* Rating */}
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                    How Was Your Experience?
                  </label>

                  <div className="rounded-lg border border-[var(--border-light)] bg-white px-4 py-3">
                    <StarRating />
                  </div>
                </div>

                <Textarea
                  label="Your Feedback"
                  placeholder="Tell us about your experience..."
                />

                {/* Submit */}
                <Button
                  className="
                    w-full
                    !bg-[var(--green-primary)]
                    !text-white
                    hover:!bg-[var(--green-dark)]
                  "
                >
                  Submit Your Feedback
                </Button>
              </div>
            </div>

            {/* Small Note */}
            <br></br>
            <p className="mt-5 text-center text-[11px] text-[var(--text-muted)]">
              Thank you for helping us make every journey better.
            </p>
          </div>
        </section>

        {/* ==========================================
            DECORATIVE PATTERN — BOTTOM LEFT
        ========================================== */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-0">
        </div>
      </main>

      <Footer />
    </>
  );
}