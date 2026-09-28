export function earliestBookingDate(): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date()).map(({ type, value }) => [type, value])
  );
  return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) + 2)).toISOString().slice(0, 10);
}