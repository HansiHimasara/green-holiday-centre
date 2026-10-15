# Real fleet reset — Green Holiday Centre

This bundle adds scripts and four new illustration assets. It does not replace existing application files. It is independent of Booking-Pricing-Configuration.patch.

## Fleet data

| Vehicle | LKR/km | Driver batta LKR/day | Max guests | Suggested standard bags | Suggested transmission | Suggested fuel |
|---|---:|---:|---:|---:|---|---|
| Sedan Car | 90 | 5500 | 2 | 2 | Automatic | Petrol |
| Benz Vito | 330 | 8000 | 4 | 4 | Automatic | Diesel |
| Flat Roof | 120 | 5500 | 4 | 4 | Manual | Diesel |
| Mini Coach | 160 | 5500 | 12 | 8 | Manual | Diesel |

Rates and batta come from the owner; passenger limits come from the supplied handwritten photo. Luggage, fuel, transmission and A/C are provisional assumptions, not verified specifications of actual vehicles. Confirm these in Admin > Vehicles before accepting bookings. Chauffeur is included; chauffeur language is left unspecified. Images are AI-generated representative illustrations, not actual fleet photos; descriptions state this.

The current formula already charges `(80 + route kilometres + 20 × days) × rate/km + days × driver batta`, then converts to USD and rounds up to the next USD 5. The fixed 80-km components are LKR 7200, 26400, 9600 and 12800 respectively. Do not add them again as a separate base fee. The legacy Pricing table is cleared and left empty because the current calculation does not use its baseCharge. No arbitrary route prices are inserted.

## 1. Add the patch and images

Save Real-Fleet-Reset.zip in Downloads. Run from your existing project root (where package.json is). These commands have no shell comment lines, so they can be pasted into macOS zsh.

```sh
unzip -n "$HOME/Downloads/Real-Fleet-Reset.zip" -d "$HOME/Downloads"
git apply --check "$HOME/Downloads/Real-Fleet-Reset/Real-Fleet-Reset.patch" &&
git apply "$HOME/Downloads/Real-Fleet-Reset/Real-Fleet-Reset.patch" &&
cp -n "$HOME/Downloads/Real-Fleet-Reset/public/images/vehicles/"*.png public/images/vehicles/
```

Optional isolated verification (requires the project's installed npm dependencies; never connects to your live database):

```sh
node scripts/test-real-fleet-reset.mjs
```

Commit only these additions:

```sh
git add scripts/reset-real-fleet.sh scripts/reset-real-fleet.sql scripts/test-real-fleet-reset.mjs REAL_FLEET_RESET.md public/images/vehicles/sedan-car.png public/images/vehicles/benz-vito.png public/images/vehicles/flat-roof.png public/images/vehicles/mini-coach.png &&
git diff --cached --check &&
git commit -m "Add real fleet data, illustrations and backed-up reset script" &&
git push
```

Deploy that commit through your normal production branch/PR workflow and wait for deployment success BEFORE resetting the database, so all four new image URLs exist. A push to a feature branch alone may only create a preview deployment. Never add the reset command to CI, a build hook or a scheduled job.

## 2. Prepare the production connection

Pause new bookings, admin writes and scheduled mutations during backup/reset. This operation deletes ALL rows in the ten listed application tables, including any real bookings or payments that may have arrived; it does not try to identify mocks. Full backups contain private data and password hashes: keep the backup outside Git and do not upload it to chat.

Install PostgreSQL client tools if absent (Homebrew is required for this command):

```sh
brew install libpq
export PATH="$(brew --prefix libpq)/bin:$PATH"
```

Use the same production database that Vercel uses, with a direct or session-pooler connection supported by your provider. Do not use a transaction-pooler URL for this maintenance operation. Use a DB owner/maintenance role with permission to dump the full DB and modify these tables. pg_dump must support the server version. A failed backup stops the script before deletion.

Paste the production connection URL privately at this hidden prompt in macOS zsh (do not paste credentials into chat):

```sh
read -rs "DATABASE_URL?Paste production DATABASE_URL: "
printf '\n'
export DATABASE_URL
bash scripts/reset-real-fleet.sh --preview
```

Preview lists current database/role and table counts; it does not modify data. Check the intended production database is selected.

## 3. Apply ONCE

```sh
bash scripts/reset-real-fleet.sh --apply
unset DATABASE_URL
```

The script first creates a full PostgreSQL custom-format backup under `$HOME/green-holiday-db-backups` with private permissions and checks that its archive directory is readable. It then runs an explicit transaction with locks and timeouts.

- Preserves every row and field in public.user, including passwords, roles and statuses.
- Clears feedback, payment, bookingDestination, booking, customer, pricing, contactMessage, session, passwordResetToken and vehicleType.
- Inserts exactly four ACTIVE vehicles with positive rate/km and driver batta.
- Does not drop schemas, tables, constraints, Prisma metadata or migrations.
- Does not restart sequences; old browser vehicle IDs cannot accidentally select a new vehicle.
- Checks that all user fields remain identical before commit. SQL errors roll back the data changes.
- Clearing sessions logs admins out; sign in again with the same accounts. Password-reset links stop working.

This is intentionally destructive and NOT a normal reusable seed command. Running it again deletes bookings received since the previous run. The backup precedes the transaction, so pausing writes matters. Preview is always safe to repeat.

## 4. Verify

Sign in again. Confirm exactly four vehicles, prices, capacities and images in Admin > Vehicles and the public fleet. Start a fresh booking (discard older browser drafts) and check a route quote. Positive driver batta fixes the observed missing-batta failure; route/geocoding services and EXCHANGE_RATE_API_KEY still must work. If API-only exchange rates are selected, no LKR_PER_USD value is required, but a provider outage will block quotes without an explicitly configured fallback.

For an arithmetic check with a TEST exchange rate of 300 LKR/USD, 50 actual km and 1 day, expected USD totals are: Sedan 65; Benz Vito 195; Flat Roof 80; Mini Coach 100. This is a test rate, not a production exchange-rate recommendation.

## Recovery

Keep the exact backup path printed by the script. If SQL fails before commit, the reset transaction rolls back automatically; resolve the reported issue before retrying. If a committed reset must be undone, first stop writes. Have the database owner restore the custom-format dump into a separate empty database with pg_restore, verify users and bookings, then perform a controlled database switch or restore. Do not blindly restore over a live DB that has received newer bookings.

## Validation performed

The reset was executed against a disposable PGlite database initialized from this uploaded project's actual Prisma schema. Fixtures populated every application table. Checks passed for exact preservation of all user fields, removal of old data, correct four fleet records, asset existence, no ID reuse, and complete row rollback after an injected SQL failure. Shell syntax also passed. No live database has been changed by this bundle's creation.
