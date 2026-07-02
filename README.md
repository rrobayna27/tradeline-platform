# Tradeline — Construction Intelligence Platform

South Florida construction & CRE news, a live project database, and general
contractor + subcontractor directories, built with Next.js, TypeScript,
Tailwind CSS, and Prisma/PostgreSQL.

This is the "Phase 3" real codebase for the Tradeline project. See the parent
folder's `START-HERE.md`, `PROJECT-BRIEF.md`, `DECISIONS.md`, and
`ROADMAP.md` for the product vision, guardrails, and history — the older
`/app` HTML prototype there is now the visual/UX reference for this build.

## Stack

- **Next.js 16** (App Router) + **TypeScript**, **Tailwind CSS v4**
- **Prisma 6** ORM targeting **PostgreSQL** (schema in `prisma/schema.prisma`)
- **Auth.js (next-auth v5)** with role-based access (Admin / GC / Sub / Member)
- **MapLibre GL** (via `react-map-gl`) for the interactive project map — no
  paid API key required
- **Zod** for input validation

## Getting started locally

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL and AUTH_SECRET
npx prisma generate
npx prisma db push     # or: npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000.

## Important: the data layer today vs. once a database is connected

The app currently runs on an **in-memory data provider** (`src/lib/repositories/index.ts`)
backed by hand-written, clearly-labeled **sample/illustrative** fixtures in
`src/data/sample/*`. Nothing in there is a real company, project, or news
event — see `DECISIONS.md` guardrail #6 ("be honest about data").

Why not Prisma from the start? Generating a real Prisma Client requires
downloading its query/schema-engine binaries from `binaries.prisma.sh`. In
*this build sandbox*, that domain is blocked by the environment's network
policy, so `npx prisma generate` / `db push` / `migrate` cannot run here. On
a normal machine, in CI, or on Vercel, that download works fine — this is
purely a limitation of the sandbox this codebase was first built in, not of
the app itself.

Everything needed to go live is already written:

- `prisma/schema.prisma` — the full production schema (Postgres, all models
  in the product brief: County, City, Trade, Developer, GeneralContractor,
  Subcontractor, Project, ProjectUpdate, Article, User/Role, BidInvite,
  NewsletterSubscriber, Advertisement, SiteSetting, MarketStat, and the
  Auth.js Account/Session/VerificationToken models).
- `prisma/seed.ts` — seeds a real Postgres database with the exact same
  sample data currently powering the UI, so the live site looks identical on
  day one.
- `src/lib/types.ts` — hand-written types mirroring the schema, used until
  the generated Prisma Client types take over.

**To go live:** stand up a Postgres instance (Neon, Supabase, Railway, RDS —
all work), set `DATABASE_URL` in `.env`, run the three commands above, then
swap the functions in `src/lib/repositories/index.ts` from reading
`src/data/sample` to calling `prisma.<model>.findMany(...)` etc. The function
signatures are already async and already shaped the way Prisma returns data,
so this is a mechanical swap, model by model — no UI code needs to change.

## Auth

Uses `next-auth` v5 (beta) with a Credentials provider and JWT sessions.
`src/lib/demo-users.ts` holds three demo accounts (password `tradeline-demo`
for all of them) so the sign-in flow and `/admin` role gate can be exercised
today:

- `admin@tradelinefl.com` — ADMIN (can access `/admin`)
- `gc@tradelinefl.com` — GC
- `sub@tradelinefl.com` — SUB

Swap `findDemoUser` in `src/auth.ts` for a real Prisma lookup once the
database is live — the bcrypt-hash comparison is written the same way either
path.

## Fonts

The brand fonts are Archivo (body/display) and Space Mono (data/numerals),
per `DECISIONS.md`. They're normally loaded via `next/font/google`, which
needs to fetch `fonts.googleapis.com` at build time — also blocked in this
sandbox. `src/app/layout.tsx` has the exact snippet to restore them once
building somewhere with normal internet access; until then, solid system-font
stacks are used so the app still looks intentional.

## Project structure

```
prisma/                  schema.prisma, seed.ts
src/
  app/                    routes (App Router)
    (marketing pages)     /, /news, /projects, /general-contractors, ...
    admin/                admin panel (ADMIN-only, gated by src/proxy.ts)
    api/                  route handlers (newsletter, join, auth)
  components/
    ui/                   design-system primitives (Button, Card, Badge, ...)
    layout/                header, footer
    project/ article/ company/ map/ admin/ home/
  data/sample/            sample/illustrative fixtures (see note above)
  lib/
    repositories/         data-access layer (swap to Prisma here)
    types.ts              hand-written domain types
    auth.ts (src/auth.ts) next-auth config
  proxy.ts                route protection for /admin (Next 16 "proxy" convention)
```

## SEO

Per-page metadata, Open Graph/Twitter cards, JSON-LD structured data on
project and article pages, `sitemap.ts`, and `robots.ts` are all wired up —
see `src/app/sitemap.ts` / `src/app/robots.ts`.

## Deploying

Any Next.js host works (Vercel is the simplest). Set the environment
variables from `.env.example`, connect a Postgres database, and run the
Prisma commands above as part of your build/release step.
