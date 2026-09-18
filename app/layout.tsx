import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
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
    <html lang="en" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}