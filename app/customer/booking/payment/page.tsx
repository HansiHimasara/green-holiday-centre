"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/src/client/apiFetch";
import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import DecorativePattern from "@/components/ui/DecorativePattern";

// Card details are entered only at the Mastercard-hosted bank page.
// The payment API calculates the amount from the saved booking on the server.

type PaymentBooking = {
  bookingId: number;
  bookingReference: string;
  customerEmail: string;
  serviceType: "AIRPORT_TRANSFER" | "DAY_TOUR" | "ROUND_TOUR";
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
};

type ConfirmationResponse = {
  booking?: PaymentBooking;
  error?: string;
};

const fieldClass =
  "w-full rounded-xl border border-[#D8E5DD] bg-[#F7FAF8] px-4 py-3 text-[14px] text-[#164A38] outline-none focus:border-[#2777A0] focus:ring-2 focus:ring-[#2777A0]/15 disabled:opacity-70";
const labelClass = "mb-2 block text-[12px] font-bold text-[#184B3C]";

type CheckoutSession = {
  sessionId: string;
  orderId: string;
  checkoutScriptUrl: string;
};

declare global {
  interface Window {
    Checkout?: {
      configure: (options: { session: { id: string } }) => void | Promise<void>;
      showPaymentPage: () => void | Promise<void>;
    };
  }
}

async function loadMastercardScript(src: string): Promise<void> {
  const url = new URL(src);
  if (url.protocol !== "https:" || !/(?:^|[.-])gateway\.mastercard\.com$/.test(url.hostname) ||
      url.pathname !== "/static/checkout/checkout.min.js" || url.search || url.hash) {
    throw new Error("The payment gateway returned an unexpected checkout script URL.");
  }
  if (window.Checkout) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error("The bank-hosted payment page could not be loaded."));
    };
    document.head.appendChild(script);
  });
}

export default function PaymentPage() {
  const [booking, setBooking] = useState<PaymentBooking | null>(null);
  const [receiptEmail, setReceiptEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [confirmationHref, setConfirmationHref] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const inFlight = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(window.location.search);
    const id = params.get("booking");
    const token = params.get("token");

    
if (!id || !token) {
  void Promise.resolve().then(() => {
    if (controller.signal.aborted) return;

    setFetchError(
      "Open this payment page through your booking summary or reservation link."
    );
    setLoading(false);
  });

  return () => controller.abort();
}

    // Read the SAVED booking from the server, not an editable sessionStorage quote.
    // The confirmation endpoint verifies a booking-specific receipt token.
    apiFetch(`/api/booking-confirmation?${new URLSearchParams({ booking: id, token })}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = (await response.json()) as ConfirmationResponse;
        if (!response.ok || !data.booking) {
          throw new Error(data.error || "Unable to load booking details.");
        }
        return data.booking;
      })
      .then((savedBooking) => {
        if (controller.signal.aborted) return;
        if (
          savedBooking.currency !== "USD" ||
          !Number.isFinite(savedBooking.totalAmount) ||
          savedBooking.totalAmount <= 0
        ) {
          throw new Error("The saved USD amount is unavailable. Please contact the travel office.");
        }
        setBooking(savedBooking);
        setReceiptEmail(savedBooking.customerEmail || "");
        setConfirmationHref(`/customer/booking/confirmation?${new URLSearchParams({ booking: String(savedBooking.bookingId), token })}`);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setFetchError(error instanceof Error ? error.message : "Unable to load booking details.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const serviceTab = booking?.serviceType === "DAY_TOUR" ? "day-tour"
    : booking?.serviceType === "ROUND_TOUR" ? "round-tour" : "airport-transfer";
  const isPaid = booking?.paymentStatus === "PAID";
  const isCancelled = booking?.status === "CANCELLED";
  const amount = booking ? booking.totalAmount.toFixed(2) : "";

  async function handlePreviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!booking || isPaid || isCancelled || booking.paymentStatus === "PENDING" || inFlight.current) return;
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
      setPaymentError("The payment link is invalid. Open this page from your booking confirmation.");
      return;
    }
    inFlight.current = true;
    setPaymentError("");
    setIsOpening(true);
    try {
      const response = await apiFetch("/api/booking-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking: booking.bookingId, token }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = typeof data === "object" && data !== null && "error" in data &&
          typeof data.error === "string" ? data.error : "Could not begin secure checkout.";
        throw new Error(message);
      }
      if (typeof data !== "object" || data === null || !("sessionId" in data) ||
          !("orderId" in data) || !("checkoutScriptUrl" in data) ||
          typeof data.sessionId !== "string" || !data.sessionId ||
          typeof data.orderId !== "string" || !data.orderId ||
          typeof data.checkoutScriptUrl !== "string" || !data.checkoutScriptUrl) {
        throw new Error("The payment gateway returned an invalid checkout session.");
      }
      const checkoutSession = data as CheckoutSession;
      await loadMastercardScript(checkoutSession.checkoutScriptUrl);
      if (!window.Checkout) throw new Error("The Mastercard checkout library did not initialize.");
      await window.Checkout.configure({ session: { id: checkoutSession.sessionId } });
      await window.Checkout.showPaymentPage();
      // The bank redirects to our result page for authenticated server-side verification.
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Secure payment checkout could not be opened.");
      inFlight.current = false;
      setIsOpening(false);
    }
  }

  return (
    <BookingPageShell>
      <section className="relative overflow-hidden bg-white">
        <DecorativePattern position="bottom-right" />
        <div className="relative mx-auto w-full max-w-[1180px] px-5 pt-7 md:px-10">
          <ServiceTabs active={serviceTab} />
        </div>
        <div className="relative mx-auto mt-8 w-full max-w-[1180px] border-b border-[var(--border-light)] px-5 pb-5 md:px-10">
          <BookingStepHeader title="Payment Details" step={4} totalSteps={4} />
        </div>
      </section>

      <section className="min-h-[500px] bg-[#F7F9F5] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-[740px] overflow-hidden rounded-[20px] border border-[#DDE8E0] bg-white shadow-[0_16px_45px_rgba(7,91,69,0.08)]">
          <div className="flex h-[6px]" aria-hidden="true">
            <span className="w-[40%] bg-[#0B6B4B]" />
            <span className="w-[30%] bg-[#F2C94C]" />
            <span className="w-[30%] bg-[#176C84]" />
          </div>
          <div className="border-b border-[#E2EBE4] px-6 py-7 sm:px-9">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#176C84]">Green Holiday Centre · Secure Checkout</p>
            <h1 className="mt-2 font-serif text-[30px] font-bold text-[#0B6B4B]">Payment Details</h1>
            <p className="mt-2 text-[13px] text-[#61776C]">Review the fixed invoice details below. The price is taken from your saved reservation.</p>
          </div>

          <div className="px-6 py-8 sm:px-9">
            {loading ? <p role="status" className="text-[#526B60]">Loading invoice details…</p> : null}
            {fetchError ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{fetchError}</p> : null}
            {!loading && !fetchError && booking ? (
              <>
                {/* Invoice fields for a secure Mastercard-hosted checkout.
                    All invoice values come from a receipt-token-verified server response.
                    The bank page receives the card data, not this website. */}
                <form onSubmit={handlePreviewSubmit} className="space-y-5" autoComplete="on">
                  <div className="rounded-xl border border-[#D9E8DD] bg-[#F1F8F4] px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[12px] font-bold text-[#0B6B4B]">Invoice amount (USD)</span>
                      <span className="rounded-full bg-[#F2C94C]/35 px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#536129]">FIXED AMOUNT</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-serif text-[35px] font-bold text-[#0B6B4B]">${amount}</span>
                      <span className="text-[13px] font-bold text-[#176C84]">USD</span>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="orderAmount" className={labelClass}>Invoice Amount</label>
                      <input id="orderAmount" name="order.amount" type="text" value={amount} readOnly aria-readonly="true" className={fieldClass} />
                    </div>
                    <div>
                      <label htmlFor="orderCurrency" className={labelClass}>Invoice Currency</label>
                      <input id="orderCurrency" name="order.currency" type="text" value="USD" readOnly aria-readonly="true" className={fieldClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="invoiceNumber" className={labelClass}>Invoice Number / Booking Reference</label>
                    <input id="invoiceNumber" name="inv_number" type="text" value={booking.bookingReference} readOnly aria-readonly="true" className={fieldClass} />
                  </div>

                  <div>
                    <label htmlFor="receiptEmail" className={labelClass}>Customer Email</label>
                    <input id="receiptEmail" name="customer_receipt_email" type="email" value={receiptEmail} readOnly aria-readonly="true" required maxLength={200} autoComplete="email" className={fieldClass} />
                    <p className="mt-1.5 text-[11px] text-[#70867C]">Payment receipts use the email on your saved reservation. Contact our office if it needs correcting.</p>
                  </div>

                  {isPaid ? (
                    <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-[#0B6B4B]">This reservation has already been marked as paid.</p>
                  ) : isCancelled ? (
                    <p role="status" className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-[#865716]">This reservation is cancelled or expired. Contact our office for assistance.</p>
                  ) : (
                    <p role="status" className="rounded-lg border-l-4 border-[#F2C94C] bg-[#FFF9E8] px-4 py-3 text-[12px] leading-5 text-[#785F23]">
                      {booking.paymentStatus === "PENDING" ? "A bank checkout is still pending. Please check its result or contact our team before trying again." : "Continue to your bank-hosted secure checkout. Card details are not entered on this website."}
                    </p>
                  )}

                  {paymentError ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{paymentError}</p> : null}
                  <button
                    type="submit"
                    disabled={isOpening || isPaid || isCancelled || booking.paymentStatus === "PENDING"}
                    className="w-full rounded-xl bg-[#0B6B4B] px-6 py-4 text-[14px] font-bold text-white transition hover:bg-[#075338] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPaid ? "Payment Already Recorded" : isOpening ? "Opening secure checkout…" : "Pay Securely with Card"}
                  </button>
                </form>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[12px] font-semibold">
                  {confirmationHref ? <Link className="text-[#176C84] underline underline-offset-4" href={confirmationHref}>View Booking Confirmation</Link> : null}
                  <Link className="text-[#0B6B4B] underline underline-offset-4" href="/customer/contact">Arrange Payment with Our Office</Link>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </BookingPageShell>
  );
}
