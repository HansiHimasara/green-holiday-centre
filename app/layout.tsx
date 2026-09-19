import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";

import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Green Holiday",
    template: "%s | Green Holiday",
  },
  description:
    "Premium private transportation and customized tours across Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}