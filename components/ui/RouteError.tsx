"use client";

import Button from "@/components/ui/Button";

/** Segment-level error handling: never render raw server/database error details. */
export default function RouteError({
  reset,
  section = "this page",
  area = "customer",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  section?: string;
  area?: "admin" | "booking" | "customer";
}) {
  const background =
    area === "admin" ? "bg-[#F6F8F5]" : area === "booking" ? "bg-white" : "bg-[#F8F7F1]";
  return (
    <main role="alert" className={`flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center ${background}`}>
      <h1 className="font-serif text-3xl font-bold text-[var(--green-dark)]">
        Unable to load {section}
      </h1>
      <p className="max-w-lg text-sm text-[var(--text-secondary)]">
        The service is temporarily unavailable. Please try again or contact Green Holiday Centre.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button href={area === "admin" ? "/admin/dashboard" : "/"} variant="outline">
          {area === "admin" ? "Back to Dashboard" : "Back to Home"}
        </Button>
      </div>
    </main>
  );
}
