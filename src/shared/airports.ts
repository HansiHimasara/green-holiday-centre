export const SRI_LANKAN_AIRPORTS = [
  "Bandaranaike International Airport, Katunayake, Sri Lanka",
  "Mattala Rajapaksa International Airport, Mattala, Sri Lanka",
  "Colombo International Airport, Ratmalana, Sri Lanka",
  "Jaffna International Airport, Palaly, Sri Lanka",
  "Batticaloa Airport, Batticaloa, Sri Lanka",
] as const;

// These aliases are used for suggestions only.
// Validation accepts the canonical airport names above.
const AIRPORT_SEARCH_TERMS = [
  "cmb bia bandaranaike katunayake colombo airport",
  "hri mria mattala rajapaksa hambantota airport",
  "rml ratmalana colombo airport",
  "jaf jaffna palaly airport",
  "btc batticaloa airport",
] as const;

export function searchSriLankanAirports(query: string): string[] {
  const words = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return [...SRI_LANKAN_AIRPORTS];
  }

  return SRI_LANKAN_AIRPORTS.filter((airport, index) => {
    const searchable =
      `${airport.toLowerCase()} ${AIRPORT_SEARCH_TERMS[index]}`;

    return words.every((word) => searchable.includes(word));
  });
}

export function isSriLankanAirport(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return SRI_LANKAN_AIRPORTS.some(
    (airport) => airport.toLowerCase() === normalized,
  );
}

export function validAirportTransfer(
  pickup: string,
  dropoff: string,
): boolean {
  const from = pickup.trim().toLowerCase();
  const to = dropoff.trim().toLowerCase();

  return Boolean(
    from &&
      to &&
      from !== to &&
      (isSriLankanAirport(pickup) || isSriLankanAirport(dropoff)),
  );
}