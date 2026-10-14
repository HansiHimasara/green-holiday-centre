import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const nunito = localFont({
  src: "./fonts/NunitoSans.ttf",
  variable: "--font-nunito",
  weight: "200 900",
  style: "normal",
  display: "swap",
});

const cormorant = localFont({
  src: "./fonts/CormorantGaramond.ttf",
  variable: "--font-display",
  weight: "300 700",
  style: "normal",
  display: "swap",
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