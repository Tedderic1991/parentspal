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

Frontend code never imports the backend. The server page loads a public venue
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
npx playwright install chromium
npm run test:e2e        # starts its own demo server on port 3100
```

Unit tests exercise the actual migration and seed SQL on embedded PostgreSQL
(PGlite), including public visibility, owner isolation, denied writes, and
database constraints. They do not require Docker or Supabase credentials.

CI runs source checks, the production build, and desktop/mobile browser tests.
