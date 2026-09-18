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

      <main className="min-h-screen bg-white">
        {children}
      </main>

      <Footer />
    </>
  );
}