# Green Holiday Centre — Mastercard Hosted Checkout patch

## What this patch does

- Preserves **guest booking**: no customer sign-in required.
- Preserves the existing four-step booking and green/yellow/blue styles.
- Gives guests a choice on the summary screen: **Make a Reservation** (unpaid) or **Continue to Secure Payment**.
- Uses the saved PostgreSQL booking, customer email, **USD** amount, and booking-reference token. The browser cannot decide the amount.
- Sends card entry to Mastercard **Hosted Checkout**, never collects CVV/card details on Green Holiday Centre.
- Stores one payment attempt per gateway order in the existing `Payment` model. No schema migration is needed for this ZIP snapshot.
- On bank return, the backend retrieves the order over Mastercard's authenticated API. It changes payment status to `PAID` only when the returned order ID, currency, amount, success result, and full captured amount all match.
- Shows separate payment and booking status on the confirmation page. Payment success does NOT automatically approve the booking; admin booking confirmation remains a distinct action.
- Adds an authorized reconciliation endpoint for payments if the customer closes the tab instead of returning from the bank. Existing unpaid-reservation expiry skips outstanding payment attempts.

## Apply on a clean feature branch

```bash
git switch dev
git pull origin dev
git switch -c feature/mastercard-hosted-checkout
git apply --check ~/Downloads/green-holiday-mastercard-gateway.patch
git apply ~/Downloads/green-holiday-mastercard-gateway.patch
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Use the actual downloaded patch path if different. The patch is based on the uploaded ZIP snapshot; resolve changed-file conflicts if your `dev` branch has moved on.

## Required server environment variables

Use a local `.env.local` and equivalent HTTPS hosting secrets. NEVER commit actual API credentials.

```dotenv
# Existing booking and app configuration (keep existing real values)
APP_BASE_URL=https://greenholidaytransport.space
BOOKING_LINK_SECRET=<your-existing-random-secret-at-least-32-characters>
CRON_SECRET=<your-existing-secret>
DATABASE_URL=<your-existing-postgres-url>

# Provided only by your real bank/MPGS merchant account
MPGS_MERCHANT_ID=<bank-issued-merchant-id>
MPGS_MERCHANT_PASSWORD=<bank-issued-api-password>
MPGS_GATEWAY_URL=https://ap.gateway.mastercard.com
MPGS_MERCHANT_NAME=Green Holiday Centre
```

The hostname above is an **example**. Use the exact gateway host from the bank (test/sandbox first). Supported URLs must be HTTPS under `gateway.mastercard.com`; the patch also accepts Mastercard's hyphenated regional gateway hosts (such as `ap-gateway.mastercard.com`). Ask the merchant bank to enable Mastercard Hosted Checkout **API version 100** and the intended card brands. Do not invent credentials or use a random payment provider URL.

For local development, use `APP_BASE_URL=http://localhost:3000`, with **sandbox credentials**. The bank's return URL and production domain must be configured/allowed by your merchant account. Host with a Node.js-capable deployment, not static FTP hosting alone.

## Payment flow

1. Customer completes booking summary → server stores booking `PENDING` / `UNPAID`.
2. Customer selects online payment → `/customer/booking/payment` fetches the actual booking amount using the signed receipt token.
3. `POST /api/booking-payment` creates a pending Payment attempt, calls MPGS and opens Mastercard-hosted checkout.
4. Mastercard redirects to `/customer/booking/payment/result`; the page POSTs to `/api/booking-payment/verify`.
5. **Only** server-side `GET Retrieve Order` can change Payment/Booking payment status to `PAID`. If not fully captured, status remains pending or failed.
6. The separate booking approval status is displayed accurately at `/customer/booking/confirmation`.

## Mandatory production follow-up

Configure your deployment/external scheduler to `POST /api/cron/reconcile-payments` every 5–15 minutes with header `Authorization: Bearer <CRON_SECRET>` to reconcile captured transactions when guests do not return from checkout. Also retain your existing `cancel-unpaid` cron schedule. Reconciliation batches the first 30 pending attempts per invocation. Verify bank settlement reports and refund handling manually, and test payment approvals, failures, declined cards, timeouts, cancellation, multiple-tab attempts, and gateway outages in sandbox. The bank must confirm production credentials, approved integration, callback allowlisting, and supported card brands before handling live customer payments.

**Important:** No real bank credentials were provided; this patch cannot prove successful live payment or claim the gateway is active. Run `npm run typecheck`, `npm test`, and `npm run build` on your local machine with Node.js **>=22.18.0**. Never paste card numbers or bank API credentials into chat.
