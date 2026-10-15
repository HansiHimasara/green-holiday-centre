"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/client/apiFetch";
import { saveBookingDraft } from "@/src/client/bookingDraft";
import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";

type Outcome = "checking" | "PAID" | "PENDING" | "FAILED" | "error";

export default function PaymentResultPage() {
  const [outcome, setOutcome] = useState<Outcome>("checking");
  const [message, setMessage] = useState("");
  const [confirmationUrl, setConfirmationUrl] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(window.location.search);
    const booking = Number(params.get("booking"));
    const token = params.get("token") || "";
    const orderId = params.get("order") || "";
    if (!Number.isSafeInteger(booking) || booking < 1 || !/^[A-Za-z0-9_-]{43}$/.test(token) || !/^GHC-[0-9]+-[A-F0-9]{24}$/.test(orderId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Validate the bank return query after hydration.
      setOutcome("error");
       
      setMessage("The payment return link is incomplete.");
      return;
    }
    const query = new URLSearchParams({ booking: String(booking), token });
     
    setPaymentUrl(`/customer/booking/payment?${query}`);
    async function verify() {
      try {
        const response = await apiFetch("/api/booking-payment/verify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking, token, orderId }), signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Payment verification is unavailable.");
        if (controller.signal.aborted) return;
        if (!["PAID", "PENDING", "FAILED"].includes(data.status)) throw new Error("The gateway returned an unknown payment status.");
        setOutcome(data.status);
        setConfirmationUrl(data.confirmationUrl || "");
        if (data.status === "PAID") saveBookingDraft({ paymentStatus: "PAID" });
      } catch (reason) {
        if (!controller.signal.aborted) {
          setOutcome("error");
          setMessage(reason instanceof Error ? reason.message : "Unable to verify the payment.");
        }
      }
    }
    void verify();
    return () => controller.abort();
  }, [retryKey]);

  const heading = outcome === "PAID" ? "Payment Verified" : outcome === "FAILED" ? "Payment Not Completed"
    : outcome === "PENDING" ? "Payment Is Being Processed" : outcome === "error" ? "Verification Unavailable" : "Checking Payment";
  const notice = outcome === "PAID" ? "Your bank payment has been verified. Your travel booking approval is tracked separately."
    : outcome === "PENDING" ? "The bank has not confirmed a completed payment yet. Do not pay again until the transaction status is confirmed."
    : outcome === "FAILED" ? "The bank has not accepted this payment. You can return to payment and try again."
    : outcome === "error" ? message : "We are checking the payment directly with Mastercard. Please do not close this page.";

  return <BookingPageShell>
    <section className="bg-white"><div className="mx-auto max-w-[1180px] px-6 py-7 md:px-10"><BookingStepHeader title="Payment Result" step={4} totalSteps={4} /></div></section>
    <section className="bg-[#F7F9F5] px-5 py-14"><div className="mx-auto max-w-[650px] overflow-hidden rounded-2xl border border-[#DFE8E1] bg-white shadow-[0_16px_45px_rgba(7,91,69,0.08)]">
      <div className="flex h-[6px]"><span className="w-[40%] bg-[#0B6B4B]"/><span className="w-[30%] bg-[#F2C94C]"/><span className="w-[30%] bg-[#176C84]"/></div>
      <div className="px-7 py-12 text-center sm:px-12">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#176C84]">Green Holiday Centre</p>
        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#ECF7EF] text-3xl font-bold text-[#0B6B4B]">{outcome === "PAID" ? "✓" : outcome === "checking" ? "…" : "!"}</div>
        <h1 className="mt-5 font-serif text-[32px] font-bold text-[#0B6B4B]">{heading}</h1>
        <p role="status" className="mt-3 text-sm leading-6 text-[#526B60]">{notice}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {confirmationUrl && <Link href={confirmationUrl} className="rounded-xl bg-[#0B6B4B] px-5 py-3 text-sm font-bold text-white hover:bg-[#075338]">View Booking Confirmation</Link>}
          {(outcome === "PENDING" || outcome === "error") && <button onClick={() => { setOutcome("checking"); setRetryKey(key => key + 1); }} type="button" className="rounded-xl border border-[#0B6B4B] px-5 py-3 text-sm font-bold text-[#0B6B4B]">Check Status Again</button>}
          {outcome === "FAILED" && paymentUrl && <Link href={paymentUrl} className="rounded-xl bg-[#0B6B4B] px-5 py-3 text-sm font-bold text-white">Return to Payment</Link>}
          <Link href="/customer/contact" className="rounded-xl border border-[#DFE8E1] px-5 py-3 text-sm font-bold text-[#176C84]">Contact Support</Link>
        </div>
      </div>
    </div></section>
  </BookingPageShell>;
}
