# Green Holiday Centre — Project Audit & Route Optimization

**Basis:** User-provided `green-holiday-centre-final-review.zip` (14 Oct 2026). This report distinguishes inspection of source from executed tests. It does **not** certify a live deployment.

## Changes implemented in this package

- Added `loading.tsx` to **27** user-facing route segments (including `app/`, admin sections, customer pages, and each booking step). These appear while Next.js is loading a route segment; they **do not** replace the existing in-page client-side loading states.
- Added `error.tsx` to **26** scoped segments; existing root `app/error.tsx` is left unchanged. Boundaries allow retrying a failed render without revealing raw server/SQL error strings.
- Added `app/global-error.tsx` for root-layout failures, which the existing root error boundary cannot catch.
- Created two reusable UI fallback components, `components/ui/RouteLoading.tsx` and `components/ui/RouteError.tsx`, using the project's existing green/cream/white colors. Existing page design and normal UI are unchanged.
- Added responsive Next Image `sizes` metadata to `app/page.tsx`, `components/home/ServiceCards.tsx`, and `components/vehicles/VehicleCard.tsx`. These are resource-selection hints; no image sources, dimensions, or layouts are changed. `unoptimized` images remain unoptimized by design for remote/user-configured URLs.
- Added `tests/route-boundaries.test.ts` to check fallback coverage and avoidance of raw exception text.

**Not modified:** Booking / pricing formulas, vehicle CRUD, authentication and authorization, customer login policy, database contract and migrations, `.env` or secrets, payment processing, API responses, business rules, or displayed page content.

## Actual issues / risks found in the supplied ZIP

| Priority | Finding | Evidence / consequence | Resolution |
| --- | --- | --- | --- |
| Medium | Route loading and error coverage missing | Original contained `app/error.tsx` but no `loading.tsx` or global error fallback | **Added** segment loaders, error recovery, and global error |
| Medium | Several `next/image` fill images lack `sizes` | `app/page.tsx`, `components/home/ServiceCards.tsx`, and `components/vehicles/VehicleCard.tsx` | **Added** hints without layout changes |
| High for paid deployment | Card checkout is only a design preview | `app/customer/booking/payment/page.tsx` declares no gateway; card number / expiry / CVC disabled; `/api/booking-payment` POST returns 503 | **Unchanged intentionally**. Integrate a PCI-compliant hosted checkout and signed provider confirmation before claiming to accept real payments |
| High for production recovery | Admin backup is not verified Postgres backup/restore | `app/api/admin/backup/route.ts` exports JSON; `app/admin/backup/page.tsx` says restore must occur through the Postgres provider | **Unchanged**. Configure provider point-in-time recovery, test a restore, and record the procedure |
| Medium | Large static image payload | `public/images` ~32 MiB; `sri-lanka-cta.jpg` ~5.2 MiB; `sri-lanka-cta2.jpg` ~5.5 MiB | **Not recompressed** because the user requested unchanged visuals; prepare visually reviewed image variants in a separate task |
| Medium | Redundant large vehicle images | Five identical pairs in `public/images` and `public/images/vehicles`, duplicating ~9.84 MB | **Not deleted**: existing database-stored image URLs and hard-coded paths may refer to either location |
| Medium | Hero gallery can eagerly load several full-resolution backgrounds | `components/home/HeroGallery.tsx` maps each item to a CSS `backgroundImage`, including inactive slides | **Not reworked** to avoid changing image transitions/visible behavior |
| Medium | Rate limiter is in-memory per process | `src/server/http/guard.ts` uses a module-level Map and notes its multi-instance limitation | Use a shared rate limiter/reverse-proxy protection before broad public exposure |
| Medium | Database call failure affects server-rendered fleet pages | `src/server/vehicles.ts`, `app/customer/vehicles/page.tsx` and home page directly fetch database data | New error boundaries offer recovery; real DB availability, correct production URL/DNS, and monitoring still required |
| Medium | Prisma uses RC versions | `prisma@8.0.0-rc.15`, `@prisma/orm-postgres@8.0.0-rc.11` | Retain locked versions until a separately tested migration / compatibility upgrade |
| Low | Build artifacts were present in original review ZIP | `tsconfig.tsbuildinfo`; `app/customer/booking/payment/page.backup.txt` | Optimized ZIP excludes only the generated `.tsbuildinfo` (keeps backup text to avoid losing team work) |

### Scope note

Customer authentication is **intentionally not implemented**: only `ADMIN` and `SUPER_ADMIN` log in. Guest booking is the intended flow. Do not classify absence of customer login as a bug.

### CI and testing evidence

- **Executed here:** 3 new route-boundary tests passed via Node TypeScript stripping; syntax-transpilation of the changed/new 60 TS/TSX files reported **0 syntax diagnostics**; `git diff --check` passed.
- **Not executed here:** `npm run lint`, `npm run typecheck`, `npm test` (complete project), `npm run build`, `npm run test:integration`, live booking flow, live deployment. This environment's `node` is 22.16.0 (package requires >=22.18.0) and the registry dependencies could not be installed successfully; therefore it would be inaccurate to claim production build or full regression testing of this optimized package.
- The *user's earlier local output* reported 15/15 unit and 17/17 integration tests passing for the prior source version. Rerun them after applying this patch.

## Exact validation steps on macOS

Apply the patch against the **same source version as the supplied review ZIP** (avoid adding changes twice). Verify the patch first:

```bash
cd ~/Desktop/green-holiday-centre-dev-fresh
git status --short
git apply --check ~/Downloads/green-holiday-optimization.patch
git apply ~/Downloads/green-holiday-optimization.patch
npm ci
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run security:check
npm audit --omit=dev
```

`git apply --check` must succeed before the apply; if the source has since changed, stop and reconcile rather than using `--force` or overwriting. Check the new `loading.tsx` on slow navigations and test `error.tsx` only through a controlled development error; **do not** deliberately break the production database. Load `/`, `/customer/vehicles`, `/customer/vehicles/1`, the guest booking pages, and admin pages. Check that the page's normal appearance and behavior have not changed. Deploy only after CI is green, production secrets are stored in provider settings, Supabase/database access is verified, and actual live flows are checked.

**Security note:** This source review is not a penetration test, accessibility audit, or proof of production readiness.


## October 14 follow-up: preserve server-side admin redirects

- The generic `app/loading.tsx` and `app/admin/loading.tsx` were removed. A parent Suspense loading boundary can send a streamed `200` response before nested admin session checks redirect, changing the observable HTTP status from `307` to `200`. This caused two existing integration tests to fail.
- All child-level loading placeholders and error boundaries remain in place, including `app/admin/dashboard/loading.tsx` and the customer booking routes.
- `app/global-error.tsx` now uses `next/link` instead of a plain internal anchor to satisfy Next.js ESLint. This does not change its visible content or layout.
- On your Mac, re-run lint, typecheck, unit tests, and integration tests. This follow-up has not been verified against a running production Next.js server here.
