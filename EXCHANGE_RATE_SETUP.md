# Green Holiday Centre — ExchangeRate-API setup

The project converts private LKR expenses to a USD booking quote on the server, using ExchangeRate-API when `EXCHANGE_RATE_API_KEY` is set. No key is placed in customer code.

## Get a free key

1. Register at https://www.exchangerate-api.com/ and verify your email.
2. Copy the API key from the provider dashboard.
3. Add `EXCHANGE_RATE_API_KEY="..."` to your local `.env` and to your deployment provider's **server-side** environment secrets.
4. Optionally set `LKR_PER_USD="..."` to a management-approved manual backup rate (LKR per USD). Do not commit `.env` or post the key in chat, issues, or logs.
5. Restart the Next.js server after updating its environment variables.

## How the rate works

- The server requests `https://v6.exchangerate-api.com/v6/{key}/latest/USD`, checks `conversion_rates.LKR`, and caches the rate for 12 hours in each server process. The free plan updates rates daily.
- If the API cannot be reached and a valid `LKR_PER_USD` is configured, the server uses that agreed backup rate and logs a warning **without exposing the key**. Without either rate, the quote fails rather than silently guessing.
- `1 USD = lkrPerUsd LKR`, so `rawUsd = privateTotalLkr / lkrPerUsd`.
- For Airport Transfer, Day Tour, Round Tour: `billableKm = 80 + mapKm + 20 * numberOfDays`; `privateTotalLkr = billableKm * vehicleRatePerKm + numberOfDays * driverBattaPerDayLkr`.
- The final customer amount is `Math.ceil(rawUsd / 5 - 1e-10) * 5` (USD, always rounds UP to the next $5).
- API results are indicative midpoint rates, **not guaranteed gateway settlement rates**. Price buffer or a manually approved exchange rate may be needed for real USD billing.
- Saved bookings retain their recorded USD total. Existing booking endpoints recalculate at submission; quotes could change if the FX rate changes before the booking is placed. For strict quote-locking, implement an expiring server-side quote ID when integrating a payment gateway.
- Multiple application instances each have a separate in-memory cache; monitor free-plan usage if hosting scales.

## Tests

```bash
npm ci
npm run typecheck
npm test
npm run lint
```

Run the isolated integration suite before deploying if the project database test fixtures are available.

API documentation: https://www.exchangerate-api.com/docs/standard-requests
