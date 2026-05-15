# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Snapshot

HAUS Admin is a Vite + React 19 SPA for browsing and administering DAOhaus Moloch V3 DAOs. It is a pure client app (no backend, no Next.js, no Vercel-specific code) — wallet, chain reads, and indexer queries happen in the browser via wagmi/RainbowKit, viem, and graph-request.

Required toolchain (enforced by `engines` in `package.json`): Node `20.19.5`, npm `11.7.0`.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — `tsc -b && vite build`. **This is the only typecheck.** There is no separate `tsc` script and no test runner; build failures are how you catch type regressions.
- `npm run lint` — ESLint flat config (`eslint.config.js`); applies `typescript-eslint` recommended + react-hooks + react-refresh rules.
- `npm run preview` — Serve the production build for smoke testing.

There is no test suite. Verification means `lint` + `build` + manual checks in the browser. See `docs/VERIFICATION.md` for the per-change-type checklist.

## Environment

Copy `.env.example` to `.env`. Required vars (see `src/lib/env.ts`, surfaced by `src/app/components/EnvWarning.tsx`):

- `VITE_WALLET_CONNECT_ID`, `VITE_GRAPH_API_KEY`, `VITE_ALCHEMY_KEY`, `VITE_ETHERSCAN_KEY`, `VITE_GNOSIS_SAFE_API_KEY`

`VITE_SEQUENCE_KEY` is optional. Missing required vars do not crash the app — they trigger the `EnvWarning` banner and cause feature-specific failures (e.g., missing graph key → DAO data fails everywhere). See `docs/ENVIRONMENT.md`.

## Architecture (the big picture)

### Boot flow (`src/main.tsx`)

Provider nesting matters — child components assume each outer provider exists:

1. `WagmiProvider` (wallet/chain context)
2. `QueryClientProvider` (TanStack Query — DAO data uses `staleTime: 2min`, `gcTime: 10min`)
3. `RainbowKitProvider` (wallet UI, dark theme)
4. `DaoHooksProvider` (injects `graphKey` for shared DAO hooks)
5. `HausThemeProvider` (theming via styled-components)
6. `RouterProvider`

### Route shape (`src/router.tsx`)

Two layout containers split the route tree:

- `HomeContainer` wraps `/` (Home) and `/summon`.
- `DaoContainer` wraps `/molochv3/:daochain/:daoid/*` and **also initializes a `TXBuilder`** with DAO-aware state. Every DAO sub-route (overview, proposals, members, safes, settings, ragequit, etc.) inherits that tx context — do not re-create it inside child routes.

DAO URLs are always namespaced by `:daochain/:daoid` — that pair is the canonical DAO identity throughout the app.

### Three-tier source layout (`src/`)

The split is enforced by convention, not by tooling. When deciding where code goes:

- **`src/app/`** — Routing, layout shells, app-wide hooks/components. Route entrypoints in `routes/` are thin and delegate to features.
- **`src/features/<area>/`** — Domain UI grouped by user-facing area: `home`, `dao`, `summon`, `proposal`, `member`, `safe`, `settings`. Feature folders own their own `components/`, `hooks/`, `utils/`. **Do not import across features** — promote shared code to `src/lib`.
- **`src/lib/`** — Reusable infrastructure. Key sub-areas:
  - `dao-hooks/` — All shared graph queries (DAO, members, proposals, tokens, vaults). Hook implementations live in `hooks/`, query strings in `utils/queries.ts`. Route-specific shaping does **not** belong here.
  - `tx-builder/` — Generic transaction execution: arg resolution (`utils/args.ts`), multicall encoding, lifecycle callbacks, decoding. Route-agnostic. Feature code should describe *what* tx to run via tx legos and let `TXBuilder`/`useTxBuilder` execute.
  - `legos/` — Reusable DAO building blocks: `form.ts` (form catalogs), `tx.ts` (transaction definitions), `fields.ts` (field definitions), `contracts.ts` (contract definitions), `fields/` (custom field components like `SafeSelect`). Adding a proposal type usually means editing `form.ts` + `tx.ts`.
  - `form-builder/` — Generic form rendering engine that consumes form legos.
  - `keychain-utils/` — Network/chain metadata, contract keychains, address validation.
  - `ui/` — Theme + styled-components-based design primitives.
  - `abis/`, `data-fetch-utils/`, `utils/`, `wagmi-config.ts`, `env.ts`.

### Read-data flow

Route → `useCurrentDao` (or feature hook) → `@/lib/dao-hooks` query hook → graph-request → TanStack Query cache → component render. If you need new shared DAO data, add a hook to `src/lib/dao-hooks/hooks/` and export it from its `index.ts`.

### Write/transaction flow

Feature input → feature `utils/transactions.ts` (translates form values into tx args or selects a tx lego) → `TXBuilder.fireTransaction` → wagmi/viem signing → lifecycle callbacks update toasts and trigger refetches. The Summon flow is the canonical reference (`src/app/routes/Summon.tsx` → `src/features/summon/components/SummonerForm.tsx` → `src/features/summon/utils/transactions.ts` → `src/lib/tx-builder/TXBuilder.tsx`).

### Path aliases (`vite.config.ts`)

`@/lib`, `@/app`, `@/features`, `@/assets` map to the corresponding `src/` subdirs. Prefer aliases over relative climbs (`../../../`). Prefer barrel imports (`@/lib/dao-hooks`, `@/lib/tx-builder`, `@/lib/legos`) over deep paths when the public export covers your need.

## AGENT.md guides (read these before changing the area)

The repo has per-folder `AGENT.md` files that describe local conventions and entry points. Read the nearest one before editing:

- Top-level: `src/AGENT.md`
- App shell: `src/app/AGENT.md`
- Lib: `src/lib/dao-hooks/AGENT.md`, `src/lib/tx-builder/AGENT.md`, `src/lib/form-builder/AGENT.md`, `src/lib/legos/AGENT.md`, `src/lib/ui/AGENT.md`, `src/lib/keychain-utils/AGENT.md`
- Features: `src/features/{home,dao,summon,proposal,member,safe,settings}/AGENT.md`

`docs/DEBUGGING.md` is a symptom-keyed map ("DAO route does not load", "Proposal action data is wrong", etc.) → starting files. Use it as a first-pass router for bug reports. `docs/DOMAIN_GLOSSARY.md` defines DAO/Moloch terminology (Baal, shaman, shares, loot, ragequit, lego, etc.).

## Conventions worth remembering

- Vite asset middleware (`vite.config.ts`) serves favicon, manifest, and PWA icons from `src/assets/` at fixed root paths in dev and emits them as bundle assets in build — do not move those files without updating `APP_ASSET_ROUTES`.
- `package.json` pins `hono` to `4.12.12` and overrides `axios`/`follow-redirects` for transitive-dep security patches. Don't unpin without a reason.
- The repo uses npm (lockfile is `package-lock.json`); `.nvmrc` and `.npmrc` are present. Use the exact versions in `engines`.
