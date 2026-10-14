/** Only shown while Next.js loads a route segment; existing pages are unchanged. */
type RouteArea = "admin" | "booking" | "customer";

export default function RouteLoading({
  label = "Loading page...",
  area = "customer",
}: {
  label?: string;
  area?: RouteArea;
}) {
  const background =
    area === "admin" ? "bg-[#F6F8F5]" : area === "booking" ? "bg-white" : "bg-[#F8F7F1]";

  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex min-h-[60vh] items-center justify-center px-6 ${background}`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--green-primary)]/20 border-t-[var(--green-primary)] motion-reduce:animate-none"
        />
        <p className="text-sm font-semibold text-[var(--green-dark)]">{label}</p>
      </div>
    </main>
  );
}
