# Green Holiday Centre: implementation notes

This source is based on the uploaded `green-holiday-centre-clean.zip`. It preserves the page styling while connecting fleet, bookings, and key admin records to the existing Postgres contract.

## Setup

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local` and supply real values. Never put credentials in Git or a shared ZIP.
3. Set `DATABASE_URL` to the project's existing Postgres database. The uploaded project uses Prisma ORM Postgres contracts; apply its existing migrations in the team's standard deployment process.
4. Set `OPENROUTESERVICE_API_KEY` for driving route calculations. The location search uses Photon.
5. Set `LKR_PER_USD` and each of `AIRPORT_TRANSFER_MARKUP_LKR`, `DAY_TOUR_MARKUP_LKR`, and `ROUND_TOUR_MARKUP_LKR`. Pricing fails closed while values are missing. These are admin set conversion and markup inputs, not a live exchange feed.
6. Set SMTP values, `APP_BASE_URL` to the public HTTPS origin, `BOOKING_LINK_SECRET` to a random secret of at least 32 characters, and `CRON_SECRET` to a separate random secret. Configure the same `APP_BASE_URL` and `CRON_SECRET` as repository action secrets for the daily reservation expiry task. A public deployment is needed for customer links.
7. Run `npm test` and `npm run build`. Use the real database and map credentials for manual end-to-end tests.

## Completed

- Home image swipe gallery uses the bundled Sri Lanka photos; vehicle cards and fleet pages read active vehicle records. The detail route is `/customer/vehicles/[id]`. A card links to the airport transfer form with its vehicle ID; the booking draft keeps the vehicle across service tabs.
- Server and browser enforce travel dates at least two Sri Lankan calendar days out. Unpaid reservations are cancelled when the date is three days out by the authenticated daily task. Reservations made inside this expiry window are rejected.
- Quotes use map road kilometres plus 20 km, vehicle LKR per km, a service specific LKR markup, then the configured LKR/USD divisor; server recalculates before saving the USD amount.
- Customer and admin feedback starts hidden until an admin approves it. Public feedback submissions now call the API.
- Admin customers, vehicles, bookings, feedback, dashboard and reports load actual records. Vehicle editors accept a photo URL and LKR per km rate. The admin backup screen downloads a real business-data export and no longer claims that a browser state change restored a database.
- No local card fields or fake payment success remain. Signed email payment links identify a booking but checkout is inactive until the existing gateway is integrated.

## Required before production

- Obtain Green Holiday Travels' existing payment gateway documentation, merchant credentials, sandbox, callback verification rules, supported USD settlement, and live domain. Implement its hosted checkout and verified server callback. Only that callback may mark `Payment` as PAID, `Booking` as CONFIRMED, and send the confirmation email. The current `/api/booking-payment` POST responds 503 on purpose.
- Provide the actual database and test SMTP delivery, exchange rate policy, routing quotas, end-to-end booking, role checks and reservation expiry. The app cannot prove these from the uploaded ZIP alone.
- Configure provider-managed Postgres backups with restore testing and retention. The admin data export is a JSON snapshot of business tables, not a full recoverable database backup.
- Define an explicit vehicle category field in the database and regenerate its Prisma contract. Until then the home page infers Sedan/SUV/Bus from database vehicle names, and shows up to three active records per category. Existing vehicle records need image URLs and rate/km values.
- Add durable image upload storage if admins must upload a file instead of entering an HTTPS image URL. The existing profile photo selector is not persisted without such a service.
- Add load tests, rate limiting and a production security review. The code and two unit tests are not a standards certification.
