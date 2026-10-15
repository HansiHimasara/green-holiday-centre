/** Server-only exchange rate lookup. 1 USD = `rate` LKR. Do not import from client components. */
type ExchangeRateApiResponse = {
  result?: string;
  base_code?: string;
  conversion_rates?: { LKR?: number };
};

const CACHE_MS = 12 * 60 * 60 * 1000; // Free-plan rates update daily.
const REQUEST_TIMEOUT_MS = 5_000;

let cache: { key: string; rate: number; expiresAt: number } | null = null;
let inFlight: { key: string; promise: Promise<number> } | null = null;

function positiveRate(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

/**
 * Prefer ExchangeRate-API, with an explicitly configured manual rate as a fallback.
 * The API key is read ONLY on the server, never exposed to customer responses.
 */
export async function getLkrPerUsd(): Promise<number> {
  const key = process.env.EXCHANGE_RATE_API_KEY?.trim();
  const manualRate = positiveRate(process.env.LKR_PER_USD);

  if (!key) {
    if (manualRate !== null) return manualRate;
    throw new Error("Set EXCHANGE_RATE_API_KEY or a positive LKR_PER_USD rate.");
  }

  if (cache?.key === key && Date.now() < cache.expiresAt) {
    return cache.rate;
  }

  if (inFlight?.key !== key) {
    const request = (async () => {
      // Never log this URL: the API key is embedded in its path.
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${encodeURIComponent(key)}/latest/USD`,
        { cache: "no-store", signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
      );
      if (!response.ok) throw new Error("Exchange-rate provider returned an HTTP error.");

      const data = (await response.json()) as ExchangeRateApiResponse;
      const rate = data.conversion_rates?.LKR;
      if (
        data.result !== "success" || data.base_code !== "USD" ||
        typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0
      ) {
        throw new Error("Exchange-rate provider returned an invalid rate or an API error.");
      }
      cache = { key, rate, expiresAt: Date.now() + CACHE_MS };
      return rate;
    })();
    inFlight = { key, promise: request };
  }

  const request = inFlight?.promise;
  if (!request) throw new Error("Could not initialize exchange-rate lookup.");
  try {
    return await request;
  } catch {
    if (manualRate !== null) {
      console.warn("Exchange-rate API unavailable; using configured LKR_PER_USD fallback.");
      return manualRate;
    }
    throw new Error("Live exchange rate unavailable. Please try again later.");
  } finally {
    if (inFlight?.promise === request) inFlight = null;
  }
}
