
"use client";

import type { ReactNode } from "react";

import { MapPin, Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTitle from "@/components/common/PageTitle";
import ContactInfoItem from "@/components/contact/ContactInfoItem";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

// Contact links
const ADDRESS =
  "62/3, Muhandiram E D Dabre Mawatha, Colombo 00500";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=62%2F3%2C%20Muhandiram%20E%20D%20Dabre%20Mawatha%2C%20Colombo%2000500";

const EMAIL = "info@greenholiday.lk";
const WHATSAPP_NUMBER = "94770102448";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const interactiveClasses =
  "block w-full rounded-xl text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--green-primary)]";

export default function ContactPage() {
  function openWhatsApp() {
    const confirmed = window.confirm(
      "Would you like to continue to WhatsApp and chat with Green Holiday Centre?"
    );

    if (confirmed) {
      window.open(
        WHATSAPP_URL,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

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

                <p className="mt-4 max-w-[480px] text-[13px] leading-6 text-[var(--text-secondary)]">
                  Have a question about your journey, transportation, or
                  booking? Our team is happy to help.
                </p>

                <div className="mt-7 space-y-4">
                  {/* Address: opens Google Maps */}
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${ADDRESS} in Google Maps`}
                    className={`${interactiveClasses} rounded-xl hover:bg-white/80`}
                  >
                    <ContactInfoItem
                      icon={<MapPin size={18} />}
                      label="Address"
                      value={ADDRESS}
                    />
                  </a>

                  {/* Email: opens the visitor's email application */}
                  <a
                    href={`mailto:${EMAIL}`}
                    aria-label={`Email Green Holiday Centre at ${EMAIL}`}
                    className={`${interactiveClasses} rounded-xl hover:bg-white/80`}
                  >
                    <ContactInfoItem
                      icon={<Mail size={18} />}
                      label="Email"
                      value={EMAIL}
                    />
                  </a>

                  {/* WhatsApp: confirmation before redirecting */}
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    aria-label="Contact Green Holiday Centre on WhatsApp"
                    className={`${interactiveClasses} cursor-pointer rounded-xl hover:bg-white/80`}
                  >
                    <ContactInfoItem
                      icon={<MessageCircle size={18} />}
                      label="WhatsApp"
                      value="+94 77 010 2448"
                    />
                  </button>

                  {/* Opening hours: information only */}
                  <ContactInfoItem
                    icon={<Clock size={18} />}
                    label="Opening Hours"
                    value="Monday – Friday, 9:00 AM – 5:30 PM"
                  />
                </div>

                {/* Social media */}
                <div className="mt-7 border-t border-[var(--border-light)] pt-6">
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--green-dark)]">
                    Follow Us
                  </p>
                  <br></br>

                  <div className="flex flex-wrap gap-3">
                    <SocialButton
                      label="Facebook"
                      href="https://www.facebook.com/greenholidaytravels?mibextid=wwXIfr&mibextid=wwXIfr"
                      icon={
                        <span className="text-[16px] font-bold">f</span>
                      }
                    />

                    <SocialButton
                      label="Instagram"
                      href="https://www.instagram.com/green_holiday_centre?exln=MWRvYWUyc2szeGI3OA=="
                      icon={<InstagramIcon />}
                    />

                    <SocialButton
                      label="X"
                      href="https://x.com/GreenHolidayCen?s=20"
                      icon={<span className="text-[15px]">𝕏</span>}
                    />
                  </div>
                  <br></br>

                  <p className="mt-3 text-xs leading-5 text-[var(--text-secondary)]">
                    Follow us for travel inspiration, Sri Lankan
                    destinations, and updates.
                  </p>
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

                <p className="mt-4 text-[13px] leading-6 text-[var(--text-secondary)]">
                  Send us a message and our team will get back to you.
                </p>

                <form
                  action={`mailto:${EMAIL}`}
                  method="post"
                  encType="text/plain"
                  className="mt-6 space-y-5"
                >
                  <Input
                    label="Your Name"
                    placeholder="Enter your name"
                    name="name"
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    required
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                    name="message"
                    required
                  />

                  <Button
                    className="w-full !bg-[var(--green-primary)] !text-white hover:!bg-[var(--green-dark)]"
                  >
                    Send Message
                  </Button>

                  <p className="text-xs leading-5 text-[var(--text-secondary)]">
                    Alternatively, contact us directly using the email or
                    WhatsApp options.
                  </p>
                </form>
              </div>
            </div>

            {/* Interactive map */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--green-primary)]">
                  Find Us
                </p>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--green-dark)] transition-colors hover:text-[var(--green-primary)]"
                >
                  Get Directions
                  <ExternalLink size={14} />
                </a>
              </div>

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
  href,
}: {
  label: string;
  icon: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Green Holiday Centre on ${label}`}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--green-primary)]/25 bg-white text-[var(--green-dark)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--green-primary)] hover:bg-[var(--green-primary)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--green-primary)]"
    >
      {icon}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
