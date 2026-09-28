"use client";

import { useEffect, useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import PageTitle from "@/components/common/PageTitle";
import StarRating from "@/components/feedback/StarRating";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import DecorativePattern from "@/components/ui/DecorativePattern";

export default function FeedbackPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [reviews, setReviews] = useState<{ id: number; fullName: string; rating: number; message: string }[]>([]);
  useEffect(() => {
    void fetch("/api/feedback", { cache: "no-store" }).then(async response => {
      if (response.ok) setReviews((await response.json()).feedback ?? []);
    });
  }, []);
  async function submitFeedback() {
    const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, email, bookingReference, rating, message }) });
    const data = await response.json();
    setNotice(response.ok ? "Thank you. Your review has been submitted for approval." : data.error || "Unable to submit feedback.");
  }
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
                  placeholder="Enter your name" value={fullName} onChange={event => setFullName(event.target.value)}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email" value={email} onChange={event => setEmail(event.target.value)}
                />

                <Input
                  label="Booking Reference"
                  placeholder="e.g. GH-2026-0142" value={bookingReference} onChange={event => setBookingReference(event.target.value)}
                />

                {/* Rating */}
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-[var(--text-primary)]">
                    How Was Your Experience?
                  </label>

                  <div className="rounded-lg border border-[var(--border-light)] bg-white px-4 py-3">
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                </div>

                <Textarea
                  label="Your Feedback"
                  placeholder="Tell us about your experience..." value={message} onChange={event => setMessage(event.target.value)}
                />

                {/* Submit */}
                <Button onClick={() => void submitFeedback()}
                  className="
                    w-full
                    !bg-[var(--green-primary)]
                    !text-white
                    hover:!bg-[var(--green-dark)]
                  "
                >
                  Submit Your Feedback
                </Button>
                {notice && <p role="status" className="text-sm text-[var(--green-dark)]">{notice}</p>}
              </div>
            </div>

            {/* Small Note */}
            <br></br>
            <p className="mt-5 text-center text-[11px] text-[var(--text-muted)]">
              Thank you for helping us make every journey better.
            </p>
          </div>
        </section>

        {reviews.length > 0 && <section className="mx-auto w-full max-w-[850px] px-8 pb-14 md:px-10">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-[var(--green-dark)]">Traveller Reviews</h2>
          <div className="grid gap-4">
            {reviews.map(review => <article key={review.id} className="rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-sm">
              <p className="font-semibold text-[var(--green-dark)]">{review.fullName} · {review.rating}/5</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{review.message}</p>
            </article>)}
          </div>
        </section>}

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