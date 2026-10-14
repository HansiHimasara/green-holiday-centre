"use client";

import type { ReactNode } from "react";
import { MapPin, Mail, MessageCircle, Clock } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTitle from "@/components/common/PageTitle";
import ContactInfoItem from "@/components/contact/ContactInfoItem";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden bg-[#F8F7F1]">
        {/* Page header */}
        <section className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[var(--yellow-golden)]/10" />
          <div className="pointer-events-none absolute -left-20 bottom-[-100px] h-60 w-60 rounded-full bg-[var(--sky-blue)]/8" />

          <div className="relative z-10 mx-auto w-full max-w-[850px] px-8 py-14 text-center md:px-10 md:py-16">
            <PageTitle
              eyebrow="Get In Touch"
              title="Contact Us"
              description="We are here to help you create your perfect Sri Lankan journey."
            />

            <div className="mx-auto mt-7 flex w-fit items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-[var(--green-primary)]" />
              <span className="h-1.5 w-6 rounded-full bg-[var(--yellow-golden)]" />
              <span className="h-1.5 w-6 rounded-full bg-[var(--sky-blue)]" />
            </div>
          </div>
        </section>

        {/* Contact content */}
        <section className="relative z-10 py-10 md:py-12">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
            <div className="grid gap-7 lg:grid-cols-2">
              {/* Contact details */}
              <div className="rounded-2xl border border-[var(--border-light)] bg-[#F8FAF7] p-7 shadow-[0_15px_45px_rgba(7,91,69,0.07)] md:p-8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--green-primary)]">
                  Contact Details
                </p>

                <h2 className="mt-2 font-[var(--font-display)] text-[28px] font-semibold leading-tight text-[var(--green-dark)]">
                  Let&apos;s talk about your journey.
                </h2>

                <br />

                <p className="mt-3 max-w-[480px] text-[13px] leading-6 text-[var(--text-secondary)]">
                  Have a question about your journey, transportation, or
                  booking? Our team is happy to help.
                </p>

                <div className="mt-7 space-y-5">
                  <ContactInfoItem
                    icon={<MapPin size={18} />}
                    label="Address"
                    value="62/3, Muhandiram E D Dabre Mawatha, Colombo 00500"
                  />

                  <ContactInfoItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value="info@greenholiday.lk"
                  />

                  <ContactInfoItem
                    icon={<MessageCircle size={18} />}
                    label="WhatsApp"
                    value="+94 77 010 2448"
                  />

                  <ContactInfoItem
                    icon={<Clock size={18} />}
                    label="Opening Hours"
                    value="Monday – Friday, 9:00 AM – 5:30 PM"
                  />
                </div>

                <div className="mt-7 border-t border-[var(--border-light)] pt-6">
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--green-dark)]">
                    Follow Us
                  </p>

                  <div className="flex gap-2">
                    <SocialButton
                      label="Facebook"
                      icon={<span className="text-[14px] font-bold">f</span>}
                    />

                    <SocialButton
                      label="Instagram"
                      icon={<span className="text-[14px] font-bold">◎</span>}
                    />

                    <SocialButton
                      label="X"
                      icon={<span className="text-[13px]">𝕏</span>}
                    />
                  </div>
                </div>
              </div>

              {/* Message form */}
              <div className="rounded-2xl border border-[var(--border-light)] bg-white p-7 shadow-[0_15px_45px_rgba(7,91,69,0.07)] md:p-8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--green-primary)]">
                  Send Message
                </p>

                <h2 className="mt-2 font-[var(--font-display)] text-[28px] font-semibold leading-tight text-[var(--green-dark)]">
                  How can we help?
                </h2>

                <br />

                <p className="mt-3 text-[13px] leading-6 text-[var(--text-secondary)]">
                  Send us a message and our team will get back to you.
                </p>

                <div className="mt-6 space-y-5">
                  <Input
                    label="Your Name"
                    placeholder="Enter your name"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                  />

                  <Button
                    className="w-full !bg-[var(--green-primary)] !text-white hover:!bg-[var(--green-dark)]"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>

            {/* Interactive map */}
            <div className="mt-10">
              <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--green-primary)]">
                Find Us
              </p>

              <div className="relative h-[280px] overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[#F5F1E8] shadow-[0_12px_35px_rgba(7,91,69,0.06)] md:h-[380px]">
                <iframe
                  title="Green Holiday Centre location"
                  src="https://maps.google.com/maps?q=6.8978197%2C79.8816387&z=17&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                <div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-24 bg-[var(--green-primary)]" />
                <div className="pointer-events-none absolute bottom-0 left-24 h-1.5 w-12 bg-[var(--yellow-golden)]" />
                <div className="pointer-events-none absolute bottom-0 left-36 h-1.5 w-8 bg-[var(--sky-blue)]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function SocialButton({
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--green-primary)]/25 bg-white text-[var(--green-dark)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--green-primary)] hover:bg-[var(--green-primary)] hover:text-white"
    >
      {icon}
    </button>
  );
}