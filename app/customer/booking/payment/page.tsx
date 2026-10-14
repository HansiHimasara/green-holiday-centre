"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/client/apiFetch";
import { getBookingDraft, type BookingDraft } from "@/src/client/bookingDraft";
import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import DecorativePattern from "@/components/ui/DecorativePattern";

// Reservation-only launch: there is NO online card processor connected.
// Do not accept names, card numbers, expiry dates or CVCs in this app.
// A future payment provider must implement hosted checkout and verified webhooks.
export default function PaymentPage() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore browser session booking after hydration.
    setDraft(getBookingDraft());
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("booking");
    const token = params.get("token");
    if (!bookingId || !token) {
      setLoading(false);
      return () => { active = false; };
    }
    apiFetch(`/api/booking-payment?${new URLSearchParams({ booking: bookingId, token })}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load the reservation.");
        return data;
      })
      .then((data) => {
        if (!active) return;
        setDraft({
          confirmationToken: data.confirmationToken,
          bookingId: data.booking.id,
          bookingReference: data.booking.bookingReference,
          serviceType: data.booking.serviceType,
          totalAmount: data.booking.amount,
          currency: data.booking.currency,
          paymentStatus: data.booking.paymentStatus,
          status: data.booking.status,
        });
      })
      .catch((error: unknown) => {
        if (active) {
          setDraft(null);
          setFetchError(error instanceof Error ? error.message : "Unable to open reservation link.");
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const serviceTab = draft?.serviceType === "DAY_TOUR" ? "day-tour"
    : draft?.serviceType === "ROUND_TOUR" ? "round-tour" : "airport-transfer";
  const amount = typeof draft?.totalAmount === "number" && Number.isFinite(draft.totalAmount)
    ? `USD ${draft.totalAmount.toFixed(2)}` : "Amount not available";
  const isPaid = draft?.paymentStatus === "PAID";
  const isCancelled = draft?.status === "CANCELLED";
  const confirmationHref = draft?.bookingId && draft?.confirmationToken
    ? `/customer/booking/confirmation?${new URLSearchParams({ booking: String(draft.bookingId), token: draft.confirmationToken })}`
    : null;

  return (
    <BookingPageShell>
      <section className="relative overflow-hidden bg-white">
        <DecorativePattern position="bottom-right" />
        <div className="relative mx-auto w-full max-w-[1180px] px-5 pt-7 md:px-10">
          <ServiceTabs active={serviceTab} />
        </div>
        <div className="relative mx-auto mt-8 w-full max-w-[1180px] border-b border-[var(--border-light)] px-5 pb-5 md:px-10">
          <BookingStepHeader title="Reservation status" step={4} totalSteps={4} />
        </div>
      </section>
      <section className="bg-[#F7F9F5] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-[760px] overflow-hidden rounded-[18px] border border-[#DFE8E1] bg-white shadow-[0_16px_45px_rgba(7,91,69,0.07)]">
          <div className="flex h-[6px]" aria-hidden="true">
            <span className="w-[40%] bg-[#0B6B4B]" /><span className="w-[30%] bg-[#F2C94C]" /><span className="w-[30%] bg-[#176C84]" />
          </div>
          <div className="space-y-5 px-6 py-10 text-center sm:px-10">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#176C84]">Green Holiday Centre</p>
            <h1 className="font-serif text-[32px] font-bold text-[#0B6B4B] sm:text-[40px]">Reservation payment status</h1>
            {loading ? <p role="status" className="text-[#526B60]">Checking your reservation…</p> : null}
            {fetchError ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-800">{fetchError}</p> : null}
            {!loading && !fetchError ? (
              <>
                {draft?.bookingReference ? <p className="text-sm font-bold text-[#224C40]">Reference: {draft.bookingReference}</p> : null}
                <p className="text-xl font-extrabold text-[#224C40]">{amount}</p>
                {isCancelled ? (
                  <p role="status" className="rounded-lg bg-amber-50 px-4 py-4 text-[#895414]">This reservation has been cancelled or expired. Contact our team before making any payment.</p>
                ) : isPaid ? (
                  <p role="status" className="rounded-lg bg-emerald-50 px-4 py-4 text-[#0B6B4B]">The payment is recorded as received.</p>
                ) : (
                  <p role="status" className="rounded-lg bg-[#FFF9E8] px-4 py-4 text-[#785F23]">
                    Online card payments are not available. Your reservation is {draft?.bookingReference ? "recorded" : "not yet confirmed"}; payment has <strong>not</strong> been collected. Contact our office for manual payment arrangements.
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-3 pt-3">
                  {confirmationHref ? (
                    <Link href={confirmationHref} className="rounded-lg bg-[#0B6B4B] px-5 py-3 text-sm font-bold text-white hover:bg-[#087052]">View booking confirmation</Link>
                  ) : null}
                  <Link href="/customer/contact" className="rounded-lg border border-[#0B6B4B] px-5 py-3 text-sm font-bold text-[#0B6B4B] hover:bg-[#F2F9F5]">Contact the travel office</Link>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </BookingPageShell>
  );
}
