"use client";

import { apiFetch as fetch } from "@/src/client/apiFetch";

import { useEffect, useState } from "react";
import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import SecureBadge from "@/components/bookings/SecureBadge";
import Button from "@/components/ui/Button";
import DecorativePattern from "@/components/ui/DecorativePattern";
import { getBookingDraft, type BookingDraft } from "@/src/client/bookingDraft";

export default function PaymentPage() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [message, setMessage] = useState("The payment gateway is being connected. No online payment is collected. Contact Green Holiday Centre to arrange payment.");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize browser-only draft/URL state after hydration.
    setDraft(getBookingDraft());
    const params = new URLSearchParams(window.location.search);
    if (params.get("booking") && params.get("token")) {
      setDraft(null);
      void fetch(`/api/booking-payment?${params.toString()}`, { cache: "no-store" })
        .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data; })
        .then(data => {
          setDraft({ confirmationToken: data.confirmationToken, serviceType: data.booking.serviceType, bookingId: data.booking.id, bookingReference: data.booking.bookingReference, totalAmount: data.booking.amount, currency: data.booking.currency });
          if (data.booking.paymentStatus === "PAID") setMessage("Payment has been received for this booking.");
          if (data.booking.status === "CANCELLED") setMessage("This reservation has expired or been cancelled.");
        }).catch(error => setMessage(error instanceof Error ? error.message : "Unable to open payment link."));
    }
  }, []);
  const serviceTab = draft?.serviceType === "DAY_TOUR" ? "day-tour" : draft?.serviceType === "ROUND_TOUR" ? "round-tour" : "airport-transfer";
  return <BookingPageShell>
    <section className="bg-white"><DecorativePattern position="bottom-right" />
      <div className="mx-auto w-full max-w-[1180px] px-8 pt-6 md:px-10"><ServiceTabs active={serviceTab} /></div>
      <div className="mx-auto mt-8 w-full max-w-[1180px] border-b border-[var(--border-light)] px-8 pb-5 md:px-10"><BookingStepHeader title="Payment Gateway" step={4} totalSteps={4} /></div>
    </section>
    <section className="bg-[#F8F7F1] py-8 md:py-10"><div className="mx-auto w-full max-w-[780px] px-6 md:px-8">
      <div className="mb-6 text-center"><p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[var(--green-primary)]">Almost There</p></div>
      <div className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_12px_35px_rgba(7,91,69,0.08)]">
        <div className="bg-[var(--green-dark)] px-6 py-5 md:px-7"><div className="flex items-center justify-between gap-4"><div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--yellow-golden)]">Booking Reference</p>
          <h2 className="mt-1 font-serif text-[22px] font-semibold !text-white">{draft?.bookingReference || "—"}</h2>
        </div><SecureBadge /></div></div>
        <div className="px-6 py-6 md:px-7"><p className="text-[13px] text-[var(--text-secondary)]">{message}</p>
          {typeof draft?.totalAmount === "number" && <p className="mt-4 font-serif text-[26px] font-bold text-[var(--green-dark)]">{draft.currency || "USD"} {draft.totalAmount.toFixed(2)}</p>}
          <div className="mt-5 border-t border-[var(--border-light)] pt-4"><Button href={draft?.bookingId && draft.confirmationToken ? `/customer/booking/confirmation?booking=${draft.bookingId}&token=${encodeURIComponent(draft.confirmationToken)}` : "/customer/booking/summary"} variant="outline">{draft?.confirmationToken ? "View Reservation" : "Back"}</Button></div>
        </div>
      </div>
    </div></section>
  </BookingPageShell>;
}
