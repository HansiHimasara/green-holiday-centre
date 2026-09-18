import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface BookingPageShellProps {
  children: ReactNode;
}

export default function BookingPageShell({
  children,
}: BookingPageShellProps) {
  return (
    <>
      <Header />

      <main className="bg-[var(--surface)] py-8">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}