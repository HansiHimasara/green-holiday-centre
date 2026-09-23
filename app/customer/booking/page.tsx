import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function BookingPage() {
  const steps = [
    {
      number: "01",
      title: "Choose Your Service",
      description:
        "Start by selecting Airport Transfers, Day Tours, or Round Tours.",
    },
    {
      number: "02",
      title: "Enter Travel Details",
      description:
        "Tell us your dates, passengers, locations, vehicle preference and requirements.",
    },
    {
      number: "03",
      title: "Add Personal Details",
      description:
        "Provide your contact and personal information for your booking.",
    },
    {
      number: "04",
      title: "Review Your Journey",
      description:
        "Check your service, travel details, vehicle and booking information.",
    },
    {
      number: "05",
      title: "Reserve or Pay",
      description:
        "Keep your booking as a reservation or complete your payment immediately.",
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F7F1]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--green-primary)]/[0.06]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[var(--sky-blue)]/[0.06]" />

          <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 pb-10 pt-16 md:px-10 md:pb-12 md:pt-20">
            <div className="mx-auto max-w-[780px] text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--green-primary)]">
                Your Journey Starts Here
              </p>

              <h1 className="mt-3 font-[var(--font-display)] text-[42px] font-semibold leading-tight text-[var(--green-dark)] md:text-[52px]">
                Plan. Reserve. Travel.
              </h1>

              <p className="mx-auto mt-5 max-w-[650px] text-[15px] leading-7 text-[var(--text-secondary)]">
                Choose your service, tell us about your journey, and decide
                whether you want to reserve now or pay during the same booking
                process.
              </p>

              <div className="mx-auto mt-7 flex w-fit items-center gap-2">
                <span className="h-1.5 w-7 rounded-full bg-[var(--green-primary)]" />
                <span className="h-1.5 w-7 rounded-full bg-[var(--yellow-golden)]" />
                <span className="h-1.5 w-7 rounded-full bg-[var(--sky-blue)]" />
              </div>
            </div>
          </div>
        </section>

        {/* Booking Flow */}
        <section className="bg-white py-10 md:py-14">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-10">
            <div className="mx-auto max-w-[1050px]">
              <div className="grid gap-10 md:grid-cols-5 md:gap-6">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="relative text-center"
                  >
                    {index < steps.length - 1 && (
                      <div className="pointer-events-none absolute left-[calc(50%+32px)] right-[calc(-50%+32px)] top-7 hidden h-px bg-[var(--border-light)] md:block" />
                    )}

                    <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[var(--green-dark)] text-[12px] font-extrabold text-white shadow-[0_5px_18px_rgba(7,91,69,0.15)]">
                      {step.number}
                    </div>

                    <h3 className="mt-6 font-[var(--font-display)] text-[19px] font-semibold leading-tight text-[var(--green-dark)]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-[12px] leading-6 text-[var(--text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reserve or Pay */}
<section className="bg-[#F8F7F1] py-12 md:py-16">
  <div className="mx-auto w-full max-w-[900px] px-6 md:px-10">
    <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_15px_40px_rgba(7,91,69,0.07)]">
      <div className="flex h-1.5 w-full">
        <span className="flex-1 bg-[var(--green-primary)]" />
        <span className="flex-1 bg-[var(--yellow-golden)]" />
        <span className="flex-1 bg-[var(--sky-blue)]" />
      </div>

      <div className="px-6 py-10 md:px-10 md:py-11">
        {/* Main Message */}
        <div className="text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--green-primary)]">
            Flexible Booking
          </p>

          <h2 className="mt-2 font-[var(--font-display)] text-[30px] font-semibold leading-tight text-[var(--green-dark)] md:text-[34px]">
            Reserve Now. Pay When You&apos;re Ready.
          </h2>

          <p className="mx-auto mt-3 max-w-[560px] text-[14px] font-medium leading-6 text-[var(--text-secondary)]">
            Secure your journey first — <span className="font-bold text-[var(--green-dark)]">no payment is required to make a reservation.</span>
          </p>
        </div>

        {/* Two Options */}
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--green-primary)]/15 bg-[var(--green-primary)]/[0.04] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)] text-sm font-bold text-white">
                ✓
              </div>

              <h3 className="font-[var(--font-display)] text-[19px] font-semibold text-[var(--green-dark)]">
                Make a Reservation
              </h3>
            </div>

            <br></br>

            <p className="mt-3 text-[12px] leading-5 text-[var(--text-secondary)]">
              Complete your booking without paying immediately. Your
              reservation details will be sent to your email.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--sky-blue)]/20 bg-[var(--sky-blue)]/[0.04] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sky-blue)] text-sm font-bold text-white">
                $
              </div>

              <h3 className="font-[var(--font-display)] text-[19px] font-semibold text-[var(--green-dark)]">
                Pay Now
              </h3>
            </div>

            <br></br>

            <p className="mt-3 text-[12px] leading-5 text-[var(--text-secondary)]">
              Prefer to pay immediately? Complete your secure online payment
              during the same booking process.
            </p>
          </div>
        </div>

        {/* Payment Reminder */}
        <div className="mt-6 rounded-xl border border-[var(--yellow-golden)]/25 bg-[var(--yellow-golden)]/[0.08] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--yellow-golden)] text-[11px] font-extrabold text-[var(--green-dark)]">
              !
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--green-dark)]">
                Payment Deadline
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">
                If you reserve without payment, payment must be completed
                no later than <strong>3 days before your booking date.</strong>{" "}
                Unpaid reservations will be automatically cancelled after this
                deadline.
              </p>
            </div>
          </div>
        </div>

        {/* Email Note */}
        <br></br>
        <p className="mt-6 text-center text-[11px] text-[var(--text-muted)]">
          Your booking details and reservation status will be sent to you by
          email.
        </p>

        {/* Start Journey */}
        <div className="mt-7 flex justify-center">
          <Link
            href="/customer/booking/airport-transfer"
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-[var(--green-dark)]
              px-8
              py-3
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.1em]
              !text-white
              shadow-[0_5px_0_var(--green-forest)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[var(--green-primary)]
              hover:shadow-[0_7px_0_var(--green-forest),0_10px_20px_rgba(7,91,69,0.15)]
            "
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

        
      </main>

      <Footer />
    </>
  );
}