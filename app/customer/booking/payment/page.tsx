"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "@/src/client/apiFetch";
import { getBookingDraft, type BookingDraft } from "@/src/client/bookingDraft";
import BookingPageShell from "@/components/bookings/BookingPageShell";
import BookingStepHeader from "@/components/bookings/BookingStepHeader";
import ServiceTabs from "@/components/bookings/ServiceTabs";
import DecorativePattern from "@/components/ui/DecorativePattern";

// FRONTEND DESIGN ONLY. The project currently has NO functioning payment gateway.
// Never POST card number, expiry or CVC to your own API.
// During integration replace the example card inputs below with the payment
// provider's hosted/iframe card fields or a provider-hosted checkout page.
// Your server must create the checkout session from the database booking amount
// and mark payment as PAID only after verifying a signed provider webhook.

function LockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="10" width="15" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="M2.5 10h19M6.5 15.5h4" />
    </svg>
  );
}

const inputClasses = "mt-2 w-full rounded-lg border border-[#DBE5E0] bg-white px-4 py-3.5 text-[14px] text-[#163C33] outline-none transition focus:border-[#4597B6] focus:ring-[3px] focus:ring-[#5BA7C9]/15 placeholder:text-[#A3B1AC]";
const labelClasses = "block text-[12px] font-extrabold tracking-[0.02em] text-[#244F42]";

export default function PaymentPage() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [paid, setPaid] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore browser session booking after hydration.
    setDraft(getBookingDraft());
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("booking");
    const token = params.get("token");
    if (!bookingId || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- No asynchronous payment-link lookup is needed.
      setLoading(false);
      return;
    }

    // A payment link reads real booking details from the verified server endpoint.
    apiFetch(`/api/booking-payment?${new URLSearchParams({ booking: bookingId, token })}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load booking.");
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
        setPaid(data.booking.paymentStatus === "PAID");
        setCancelled(data.booking.status === "CANCELLED");
      })
      .catch((error: unknown) => {
        if (active) { setDraft(null); setFetchError(error instanceof Error ? error.message : "Unable to open payment link."); }
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  const serviceTab = draft?.serviceType === "DAY_TOUR" ? "day-tour" : draft?.serviceType === "ROUND_TOUR" ? "round-tour" : "airport-transfer";
  const amount = typeof draft?.totalAmount === "number" && Number.isFinite(draft.totalAmount) ? draft.totalAmount : null;
  const total = amount === null ? "—" : `USD ${amount.toFixed(2)}`;

  function handleDemoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // DO NOT collect, read, store, log or transmit card data here.
    setNotice("Preview only — payment has NOT been charged. Connect a PCI-compliant payment provider's hosted fields or checkout to accept payments.");
  }

  return (
    <BookingPageShell>
      <section className="relative overflow-hidden bg-white">
        <DecorativePattern position="bottom-right" />
        <div className="relative mx-auto w-full max-w-[1180px] px-5 pt-7 md:px-10"><ServiceTabs active={serviceTab} /></div>
        <div className="relative mx-auto mt-8 w-full max-w-[1180px] border-b border-[var(--border-light)] px-5 pb-5 md:px-10">
          <BookingStepHeader title="Payment Gateway" step={4} totalSteps={4} />
        </div>
      </section>

      <section className="bg-[#F7F9F5] px-4 py-10 md:py-14">
        <div className="mx-auto max-w-[800px]">
          <div className="mb-9 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#A5D4CE] bg-[#E9F7F4] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#087052]">
              <LockIcon size={13} /> Step 04 · Secure checkout
            </span>
            <h2 className="mt-4 font-serif text-[36px] font-bold leading-tight text-[#0B6B4B] md:text-[45px]">One last step to your journey.</h2>
            <p className="mt-2 text-[14px] text-[#61776C]">Enter your payment details below to complete your reservation.</p>
          </div>

          <div className="mx-auto w-full">
            <div className="overflow-hidden rounded-[18px] border border-[#DFE8E1] bg-white shadow-[0_16px_45px_rgba(7,91,69,0.07)]">
              <div className="flex h-[6px] w-full" aria-hidden="true"><span className="w-[40%] bg-[#0B6B4B]" /><span className="w-[30%] bg-[#F2C94C]" /><span className="w-[30%] bg-[#176C84]" /></div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDF0EC] px-6 py-5 sm:px-8">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#5B91A9]">Payment details</p>
                  <h3 className="mt-1 font-serif text-[27px] font-bold text-[#0B6B4B]">Choose how to pay</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF8F2] px-3 py-2 text-[11px] font-bold text-[#0B6B4B]"><LockIcon size={14} /> Secure checkout design</span>
              </div>

              <form className="space-y-6 px-6 py-6 sm:px-8 sm:py-8" onSubmit={handleDemoSubmit} autoComplete="off">
                {fetchError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-800">{fetchError}</p>}
                {paid && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-bold text-[#0B6B4B]">Payment already received.</p>}
                {cancelled && <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] font-bold text-[#895414]">This reservation has been cancelled or expired.</p>}
                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-[#0B6B4B] bg-[#F2F9F5] px-4 py-4">
                  <span className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-[6px] border-[#0B6B4B] bg-white" />
                    <span className="text-[13px] font-extrabold text-[#173E33]">Credit / Debit Card</span>
                  </span>
                  <span className="flex flex-wrap items-center justify-end gap-2 text-[#0B6B4B]"><CardIcon /><span className="text-right text-[11px] font-bold">Visa · Mastercard · American Express</span></span>
                </div>

                <div className="rounded-lg border-l-[3px] border-[#E7BC43] bg-[#FFFAEA] px-4 py-3 text-[12px] leading-5 text-[#816521]">
                  <strong>Design preview:</strong> Card fields are disabled until a secure payment provider is connected. No payment is processed.
                </div>

                <div>
                  <label htmlFor="billingName" className={labelClasses}>Name on card</label>
                  <input id="billingName" name="billingName" type="text" placeholder="e.g. Alex Fernando" autoComplete="cc-name" required className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="cardNumber" className={labelClasses}>Card number</label>
                  {/* DEMO INPUT: REPLACE WITH GATEWAY HOSTED FIELD, NOT A SELF-POSTED CARD INPUT. */}
                  <div className="relative">
                    <input id="cardNumber" type="text" placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="off" disabled className={`${inputClasses} pr-12`} />
                    <span className="pointer-events-none absolute right-4 top-[25px] text-[#7195A3]"><CardIcon /></span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="cardExpiry" className={labelClasses}>Expiry date</label>
                    {/* DEMO INPUT: REPLACE WITH GATEWAY HOSTED FIELD. */}
                    <input id="cardExpiry" type="text" inputMode="numeric" autoComplete="off" placeholder="MM / YY" disabled className={inputClasses} />
                  </div>
                  <div><label htmlFor="cardCvc" className={labelClasses}>CVV / CVC</label>
                    {/* DEMO INPUT: REPLACE WITH GATEWAY HOSTED FIELD. */}
                    <input id="cardCvc" type="password" inputMode="numeric" autoComplete="off" placeholder="•••" disabled className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label htmlFor="billingEmail" className={labelClasses}>Email for payment receipt</label>
                  <input id="billingEmail" name="billingEmail" type="email" placeholder="you@example.com" autoComplete="email" defaultValue={draft?.customer?.email || ""} required className={inputClasses} />
                </div>
                <div className="rounded-xl border border-[#DCEAE9] bg-[#F3FAFC] px-4 py-3 text-[12px] leading-5 text-[#35697F]">
                  <span className="font-extrabold">Your amount stays in USD.</span> When connected, your payment provider will handle the encrypted payment information and verification.
                </div>

                <button type="submit" disabled={loading || paid || cancelled || amount === null || !!fetchError} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B6B4B] px-6 py-4 text-[14px] font-extrabold text-white shadow-[0_6px_0_#064735] transition hover:bg-[#087052] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5BA7C9] disabled:cursor-not-allowed disabled:opacity-50">
                  <LockIcon size={17} /> {paid ? "Payment already received" : `Pay ${total}`}
                </button>
                {notice && <p role="status" className="rounded-lg border border-[#E7C567] bg-[#FFF9E8] p-3 text-[12px] text-[#6D5414]">{notice}</p>}
                <div className="flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-[#81908C]"><LockIcon size={13} /> Checkout integration pending · No live card payments</div>
              </form>
            </div>


          </div>
        </div>
      </section>
    </BookingPageShell>
  );
}
