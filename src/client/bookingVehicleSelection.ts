/** Preserve the customer-selected vehicle when changing booking services. */
export function selectedVehicleFromSearch(search: string): number | null {
  const value = new URLSearchParams(search).get("vehicle");
  return parseVehicleId(value);
}

function parseVehicleId(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const text = String(value);
  if (!/^[1-9]\d*$/.test(text)) return null;
  const id = Number(text);
  return Number.isSafeInteger(id) ? id : null;
}

export function bookingServiceHref(
  href: string,
  vehicleId?: string | number | null,
): string {
  const id = parseVehicleId(vehicleId);
  if (id === null) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}vehicle=${id}`;
}
