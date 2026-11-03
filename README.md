# ParentsPal

A bilingual family playground-pass demo built with Next.js App Router,
TypeScript, and Tailwind CSS. It preserves the original fictional venues,
family setup, custom bundles, gift checkout, demo accounts, and visit planning.

## Run locally

Use Node.js **20.19+** (Node 22 LTS recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. No API keys are needed in the default `demo` mode.
For production: `npm run build` then `npm start`.

## GitHub Pages demo

The same application has two independent build modes:

| Command | Output | Hosting |
| --- | --- | --- |
| `npm run build` | `.next/` | Normal Next.js server; run `npm start` |
| `npm run build:pages` | `out/` | Static demo for GitHub Pages; no Next.js server |

The Pages build runs in a temporary source snapshot and removes it afterward,
so it does not overwrite `.next/`, local environment files, or server types.
It always uses fictional demo data and never queries Supabase, even when the
normal server is configured for Supabase. The regular build retains
request-time catalog reads and image optimization.

```sh
npm run build:pages
npm run preview:pages
```

Open http://127.0.0.1:3101/parentspal/. The default asset prefix is
`/parentspal`. Set `PAGES_BASE_PATH` for both build and preview if hosting
under another repository path, or set it to an empty string for a root/custom
domain site. `npm start` serves only the normal server build, not `out/`.

After merging, the repository owner must select **Settings → Pages → Build
and deployment → Source → GitHub Actions** (the existing site uses
branch-based publishing). `.github/workflows/pages.yml` publishes `out/` on
pushes to `main` or manual dispatch from `main`, using the Pages-provided
base path. PR builds validate the export but do not deploy it.
No merge or repository settings change is performed by this refactor.

## Page links and editable data

Each screen has a real URL, including `/pass/family/`, `/pass/venues/`,
`/pass/review/`, `/checkout/`, `/passes/`, `/account/`, and `/visits/plan/`.
Venue names generate readable links such as `/venues/sprout-and-play/`.
GitHub Pages adds the repository prefix, for example
`/parentspal/venues/sprout-and-play/`. Direct links, refresh, and browser
Back/Forward work without an SPA fallback server.

The shared layout keeps your in-progress demo data while navigating.
Refreshing or opening another tab starts a fresh demo; purchase and visit
confirmation URLs do not store or recreate personal information. If their
required state is missing, they offer a way to build a pass or plan a visit.

Edit these files rather than JSX to change the demo's business data:

| File | Contents |
| --- | --- |
| `src/shared/data/venues.json` | Venue IDs, names, descriptions, prices in cents, age ranges, and entry policies |
| `src/shared/data/options.json` | Payment choices, time slots, family options/defaults, currency, and bundle rules |

Keep venue IDs stable; names must produce unique URL slugs. Renaming a venue
changes its URL. Rebuild and redeploy static exports after editing either
file. UI translations remain under `src/frontend/i18n/`.

The existing server catalog repository can replace JSON venue reads with
Supabase records without changing the UI's `Venue` contract. Options remain
local configuration until a settings API/database is implemented. The SQL
seed is a separate database fixture; editing JSON does not update an existing
database. Payment choices and time slots are still illustrative, not enabled
payment providers or live availability.

## Demo limitations

Purchases, payments, accounts, bookings, and QR codes are **simulated**.
Personal details and passes exist only in memory and disappear on refresh.
The receipt is a snapshot: changing a new bundle does not change an existing
pass. Sample time slots are illustrative, not real venue availability.

## Structure

| Location | Responsibility |
| --- | --- |
| `src/app/` | Next.js routing, root layout, server entry point, global Tailwind styles |
| `src/frontend/components/` | Reusable UI and site shell |
| `src/frontend/features/` | Venues, pass builder, checkout, passes, and visit planning |
| `src/frontend/i18n/` | English/French context and the original French copy |
| `src/backend/` | Server-only Supabase client, configuration, database types, venue repository |
| `src/shared/` | Environment-independent domain types, demo catalog, pricing rules |
| `supabase/` | Database migrations, fictional seed data, local configuration |
| `tests/e2e/` | Desktop/mobile browser journeys |

Frontend code never imports the backend. The server layout loads a public venue
catalog and passes serializable domain objects to the UI; credentials stay on
the server. Next.js runs both layers in one deployment, but their code and
responsibilities are separated. There is no separate backend service to deploy.

Every maintained text/source file must stay at **500 lines or fewer**.
`npm run check:lines` enforces this across the repository. Generated dependency
lockfiles and build/test output are excluded; do not hand-edit generated files.

## Supabase setup (when ready)

The schema is prepared but no hosted database has been provisioned.
Keep `PARENTSPAL_DATA_MODE=demo` until you configure one.

For a local database, install Docker and use the Supabase CLI:

```sh
npx supabase start
npx supabase db reset
```

`db reset` is destructive to your **local development database**; it reapplies
the migrations and fictional seed. Never run it against a database with data
you need to retain. Local credentials and Studio URL are printed by the CLI.

For a hosted project, create the project in Supabase, then:

```sh
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Apply `supabase/seed.sql` using the project's SQL Editor to load the demo
catalog. Seed upserts replace the five fictional records; do not run it over
real partner records with the same IDs.

Update `.env.local` and restart Next.js:

```dotenv
PARENTSPAL_DATA_MODE=supabase
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

A legacy anonymous key also works for public catalog reads. Neither variable
uses `NEXT_PUBLIC_`. Do not use a service-role/secret key for catalog reads.
Supabase mode only connects the **venue catalog**. Failures or missing keys
are reported instead of silently switching to demo data.

After migration, regenerate the full database types if extending the backend:

```sh
npx supabase gen types typescript --linked > src/backend/supabase/database.types.ts
```

Tables include `venues`, `profiles`, `passes`, `pass_admissions`, and `bookings`.
Row-level security is enabled everywhere. Published venues are public;
authenticated users can only read their own profile/pass/admissions/bookings.
Browser writes are deliberately denied. A future real checkout must add
authentication, trusted server-side pricing, verified payment webhooks, and
transactional booking/redemption APIs before enabling writes. Authentication
and real purchases are **not** activated just by adding keys.

## Checks

```sh
npm run check           # ESLint, TypeScript, unit tests, 500-line limit
npm run build
npm run build:pages
npx playwright install chromium
npm run test:e2e        # starts its own demo server on port 3100
npm run test:e2e:pages  # serves the export on port 3101 under /parentspal/
```

Set `PARENTSPAL_E2E_SERVER=production` when running `npm run test:e2e` to test
the existing normal production build instead of the development server.

Unit tests exercise the actual migration and seed SQL on embedded PostgreSQL
(PGlite), including public visibility, owner isolation, denied writes, and
database constraints. They do not require Docker or Supabase credentials.

CI runs source checks, both builds, and desktop/mobile browser tests for both
the regular application and the prefixed static export.
