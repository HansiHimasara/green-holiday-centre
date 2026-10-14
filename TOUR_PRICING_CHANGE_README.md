# Green Holiday Centre — tour pricing update

## What changed

- Central pricing code: `src/server/bookingPricing.ts` and new testable formula `src/server/pricingFormula.ts`.
- **All services (airport transfer, day tour, round tour):** `billableKm = 80 + actualRoadKm + (20 * days)`.
- **LKR total:** `billableKm * vehicle.ratePerKm + days * vehicle.driverBattaPerDayLkr`.
- **Customer USD total:** `round((totalLkr / LKR_PER_USD) / 5) * 5`.
- **Day tour:** 1 day. **Round tour:** `numberOfNights + 1` days; the existing app already requires nights to equal the number of overnight stops.
- **Airport transfers:** use the same formula as all other services with 1 day. No separate airport markup is used.
- The three legacy `*_MARKUP_LKR` environment variables are unused. Only `LKR_PER_USD` is required for conversion.
- Admin > Vehicles includes an editable, required **Driver Batta (LKR/day)** field for every vehicle. The rate is NOT returned by the public `/api/vehicles` or `/api/booking-quote` routes.
- Both quote and final booking endpoints obtain the rate and batta from the database, never from a customer's request.
- Existing vehicles get the schema default of zero. Tours for a vehicle cannot be quoted until an admin supplies a positive daily batta for that vehicle.

## Example

1-day tour, real map route 100 km, vehicle rate Rs. 150/km, driver batta Rs. 1,800/day, assumed conversion Rs. 300 per USD:

`(80+100+20)*150 + 1*1800 = Rs. 31,800` -> `$106` -> **$105**.

3-day tour with the same 100 km map route:

`(80+100+3*20)*150 + 3*1800 = Rs. 41,400` -> `$138` -> **$140**.

**Assumptions:** The fixed 80 and daily 20 are additional *kilometres*, not USD; driver/guide batta is stored in LKR **per vehicle per day**. No map distance is guessed: `src/server/bookingPricing.ts` still obtains road-route distance from OpenRouteService.

## Required setup (before running or deploying)

**This ZIP contains source code and the Prisma contract edit, but NOT an applied database migration.** The generated Prisma files (`src/prisma/contract.json` and `.d.ts`) are intentionally left at their original, unmodified versions. Let the actual Prisma CLI regenerate those files and its storage hash; never manually hand-edit the generated artifacts.

1. Back up the database and work on a development database first. Set the existing project environment variables, especially `DATABASE_URL`, `OPENROUTESERVICE_API_KEY`, and `LKR_PER_USD`. Do not commit `.env`.
2. In your project folder, using Node >=22.18, run:

   ```bash
   npm ci
   npm run contract:emit
   npx prisma migration plan --name add_driver_batta
   npx prisma db migrate --show
   ```

3. **Review** the planned migration; it should add a non-null `driverBattaPerDayLkr` integer column with a default of zero to `public.vehicleType`. If other unrelated migrations show up, check the database migration marker before proceeding.
4. Once reviewed, apply the plan to your **development** database:

   ```bash
   npm run db:migrate
   npm run db:verify
   npm run typecheck
   npm test
   npm run build
   ```

5. In **Admin > Vehicles**, edit every vehicle and set a positive **Driver Batta (LKR/day)** and save. Test a day tour and round tour quote; verify checkout uses the same amount.
6. After verifying in development, promote the reviewed migration and code to production following your existing deployment procedure. Do not deploy code requiring the new column before the database migration.

Prisma 8 expects the migration flow: **`contract emit` -> `migration plan` -> `db migrate`**. Do not bypass this by manually altering the Supabase table, because Prisma tracks schema versions with a contract marker.

See https://www.prisma.io/docs/orm/migrations/how-migrations-work for the migration process.

## Tests and limitations

- A standalone calculation test suite was run successfully: `npm test` (includes pricing formula tests).
- All modified TypeScript/TSX/JavaScript source files were syntax checked.
- The full Next.js build, end-to-end test suite, remote routing, and database migration **were not executed here** due to unavailable project dependencies, database credentials, and routing API access. They must be verified locally before deploy.
