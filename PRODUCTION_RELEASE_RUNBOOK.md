# Green Holiday Centre — production release runbook

## Important: GitHub Actions is NOT a Next.js deployment host

The old `.github/workflows/main.yml` uploaded the repository into `/public_html/` over FTP.
That was unsafe: this is a **Node.js SSR application**, not a static website. The
replacement workflow deliberately **does not deploy**. It verifies an already deployed
HTTPS endpoint and its exact source SHA. Do not switch FTP upload back on to "make it work".

## Before any live release

1. Ask the hosting provider to confirm **Node.js >= 22.18**, support for **Next.js SSR**,
   persistent process management / restart, HTTPS proxying, secure environment variables,
   and a private working directory outside the public document root. If unsupported,
   use a Next.js-capable host and point the transport subdomain to that deployment.
2. Back up the production database, verify a restore to a different database, inspect
   Prisma's migration/contract marker and the required `vehicleType.driverBattaPerDayLkr`
   column. Plan/apply migrations in staging before production; do not alter the live
   schema from CI or by guessing SQL. See `DATABASE_SCHEMA_RELEASE_CHECK.md`.
3. Set secrets on the **server** (never in a public FTP directory): `DATABASE_URL`,
   `BOOKING_LINK_SECRET`, `CRON_SECRET`, `APP_BASE_URL`, `OPENROUTESERVICE_API_KEY`,
   `LKR_PER_USD`, SMTP settings and a verified proxy/rate-limiting setup. When TRUST_PROXY=false, the app
   does **not** invent a shared "local" client IP; you must have an upstream
   per-IP rate limiter. Set TRUST_PROXY=true only if the proxy overrides, rather
   than appends to, the untrusted X-Forwarded-For header.
   Set `DEPLOY_COMMIT_SHA` to the reviewed **full 40-character SHA**.
4. Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`,
   `npm run security:check`, `npm audit --omit=dev --audit-level=high`, and
   `npm run test:integration` in a CI/staging environment. Do not execute integration
   fixtures against the live database. Use a built-in Next-compatible deployment process.
5. Test real booking, maps/ORS, email delivery and admin auth with test data in staging.
   The application is currently **reservation-only**: the online card gateway is disabled.
6. Once the host is deployed and running, use the manual **Verify an already deployed
   release** workflow, inputting the HTTPS origin and expected Git SHA. Only announce a
   release after it returns green and the booking flow is manually smoke-tested.
7. Keep immutable release artifacts and documented rollback of application and database.
   Enable provider-managed automated backups/PITR and verify recovery.

## Not addressed by a code-only patch

The real hosting account, secret values, SMTP sender approval, external ORS quota,
provider backups, production DNS/TLS, customer data retention policy and payment
processor must be configured and tested outside GitHub. CI checks cannot certify them.

## Customer privacy and vehicle availability — required business decisions

- **Passport number:** A customer profile is reused by email. Bookings snapshot
  name/email/phone/nationality but *not* passport number. Do not interpret the
  shared Customer passport field as proof of the traveller for each reservation.
  Decide the verified traveller/retention model and create a reviewed Prisma 8
  migration for a per-booking encrypted/safeguarded document reference before
  collecting passports for unrelated passengers sharing one email.
- **Vehicle availability:** `VehicleType` is a category, not a specific van/car
  with fleet counts. The system does not atomically enforce overlapping trips.
  Every reservation must be confirmed by staff after checking availability; do
  not advertise a guaranteed vehicle or capture irreversible payments without
  a unit-allocation and concurrency-safe inventory design.
- **Privacy export:** Business JSON export includes customer and booking PII.
  It is now restricted to SUPER_ADMIN; keep downloads private and delete them
  under the agreed retention policy. It is **not** a database backup.
- **Signed links:** Receipt URLs grant access to private booking details until
  secrets change. Never publish/share full URLs or place tokens in analytics.
  Add expiring/revocable links when the business agrees a retention policy.
