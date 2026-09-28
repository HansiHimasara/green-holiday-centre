const COLOMBO_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Colombo",
  year: "numeric", month: "2-digit", day: "2-digit",
});

export function earliestBookingDate(now = new Date()): string {
  const parts = Object.fromEntries(
    COLOMBO_DAY.formatToParts(now).map(({ type, value }) => [type, value])
  );
  const date = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) + 2));
  return date.toISOString().slice(0, 10);
}

export function validBookingDate(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= earliestBookingDate(now);
}