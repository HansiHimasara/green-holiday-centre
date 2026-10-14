"use client";

import Link from "next/link";

/** Catches failures of the root layout, which app/error.tsx cannot catch. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F8F7F1", color: "#153E2A", fontFamily: "system-ui, sans-serif" }}>
        <main role="alert" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 30, margin: 0 }}>Unable to load this page</h1>
          <p style={{ maxWidth: 460, fontSize: 14 }}>The service is temporarily unavailable. Please try again or contact Green Holiday Centre.</p>
          <button type="button" onClick={reset} style={{ background: "#153E2A", color: "white", border: 0, borderRadius: 6, padding: "12px 22px", cursor: "pointer" }}>Try Again</button>
          <Link href="/" style={{ color: "#153E2A", fontSize: 14 }}>Back to Home</Link>
        </main>
      </body>
    </html>
  );
}
