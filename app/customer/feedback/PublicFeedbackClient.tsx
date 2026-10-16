"use client";

import { apiFetch as fetch } from "@/src/client/apiFetch";

import { useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import PageTitle from "@/components/common/PageTitle";
import StarRating from "@/components/feedback/StarRating";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";



export default function PublicFeedbackClient({ initialReviews }: { initialReviews: { id: number; fullName: string; rating: number; message: string }[] }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  // Published reviews are already available in the server-rendered first view.
  const [reviews] = useState(initialReviews);
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
                  placeholder="e.g. GHC-W-3001" value={bookingReference} onChange={event => setBookingReference(event.target.value)}
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

        
{/* Traveller Reviews */}
{reviews.length > 0 && (
  <section className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:px-8">
    <div className="mb-9 text-center">
      <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-[var(--green-primary)] uppercase">
        Memories from our travellers
      </p>

      <h2 className="font-serif text-3xl font-bold text-[var(--green-dark)] md:text-4xl">
        Traveller Reviews
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)] md:text-base">
        Every journey has a story. Here are some kind words from
        travellers who explored Sri Lanka with us.
      </p>

      <div className="mx-auto mt-5 flex w-fit items-center gap-1.5">
        <span className="h-1 w-7 rounded-full bg-[var(--green-primary)]" />
        <span className="h-1 w-7 rounded-full bg-[var(--yellow-golden)]" />
        <span className="h-1 w-7 rounded-full bg-[var(--sky-blue)]" />
      </div>
    </div>

    <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => (
        <article
          key={review.id}
          className={`group relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_8px_30px_rgba(7,91,69,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(7,91,69,0.12)] ${
            index % 3 === 0
              ? "rotate-[-1deg] border-[#DDE9D9] bg-[#EEF5EA] hover:rotate-0"
              : index % 3 === 1
                ? "mt-3 rotate-[1deg] border-[#EEE5CC] bg-[#FBF5E6] hover:rotate-0"
                : "rotate-[-0.5deg] border-[#DDE9D9] bg-[#F2F7F0] hover:rotate-0"
          }`}
        >
          {/* Decorative quotation mark */}
          <span
            aria-hidden="true"
            className="absolute right-5 top-2 font-serif text-6xl leading-none text-[var(--green-primary)] opacity-20"
          >
            “
          </span>

          {/* Traveller details */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white/80 text-xl shadow-sm">
              <span aria-hidden="true">🌿</span>
            </div>

            <div className="min-w-0">
              <h3 className="truncate pr-5 font-semibold text-[var(--green-dark)]">
                {review.fullName}
              </h3>

              {/* Star rating */}
              <div
                className="mt-1 flex items-center gap-0.5"
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    aria-hidden="true"
                    className={`text-xl leading-none ${
                      star <= review.rating
                        ? "text-[#E7AD32]"
                        : "text-[#D6D8CF]"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Review message */}
          <div className="relative mt-5">
            <p className="whitespace-pre-line break-words text-sm leading-7 text-[var(--text-secondary)]">
              {review.message}
            </p>
          </div>

          {/* Bottom decorative detail */}
          <div className="mt-5 flex items-center justify-between border-t border-[var(--green-primary)]/10 pt-4">
            <span className="text-xs font-medium text-[var(--green-dark)]/65">
              A traveller&apos;s story
            </span>
            <span
              aria-hidden="true"
              className="text-lg text-[var(--green-primary)]/60"
            >
              ✿
            </span>
          </div>
        </article>
      ))}
    </div>
  </section>
)}


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