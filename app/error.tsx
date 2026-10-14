"use client";
import Button from "@/components/ui/Button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F8F7F1] px-6 text-center">
    <h1 className="font-serif text-3xl font-bold text-[var(--green-dark)]">Unable to load this page</h1>
    <p className="text-sm text-[var(--text-secondary)]">The service is temporarily unavailable. Please try again or contact Green Holiday Centre.</p>
    <Button onClick={reset}>Try Again</Button>
    <Button href="/" variant="outline">Back to Home</Button>
  </main>;
}
