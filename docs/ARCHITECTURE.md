# Architecture

## Purpose

This document gives a high-level map of the application so developers and agents can quickly understand where runtime setup lives, how routes are organized, and how data and transactions move through the system.

## Tech Stack

- Vite for local development and production builds
- React 19 for UI rendering
- React Router for route containers and screens
- TanStack Query for cached remote data
- Wagmi and RainbowKit for wallet connection and chain state
- styled-components plus local UI primitives for styling

## Boot Flow

Application startup happens in [`src/main.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/main.tsx:1).

Provider order:

1. `WagmiProvider` provides wallet and chain context.
2. `QueryClientProvider` provides shared query caching.
3. `RainbowKitProvider` provides wallet UI.
4. `DaoHooksProvider` injects graph API configuration for shared DAO hooks.
5. `HausThemeProvider` provides theme context and UI theming.
6. `RouterProvider` mounts the route tree.

This means most route screens can assume wallet, query, and DAO hook configuration already exist by the time they render.

## Routing Model

Routes are defined in [`src/router.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/router.tsx:1).

- `/` uses `HomeContainer` and hosts the landing/dashboard experience.
- `/summon` hosts the DAO creation flow.
- `/molochv3/:daochain/:daoid` uses `DaoContainer` and wraps DAO-specific screens.
- DAO child routes include overview, proposals, proposal detail, members, member detail, safes, settings, settings update, new proposal, and ragequit.

`HomeContainer` and `DaoContainer` are the main shell boundaries in [`src/app/layouts`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/layouts/HomeContainer.tsx:1). `DaoContainer` also initializes a `TXBuilder` with DAO-aware state so child routes can trigger transactions without rebuilding that context.

## Code Organization

- `src/app`
  Route entrypoints, layouts, navigation shells, and app-level helpers that cut across features.
- `src/features`
  Domain-specific UI and logic grouped by user-facing capability.
- `src/lib`
  Reusable infrastructure and lower-level primitives shared across routes and features.

Important shared areas inside `src/lib`:

- `dao-hooks`
  Shared hooks and types for fetching DAO, member, proposal, token, and record data.
- `tx-builder`
  Transaction execution context and lifecycle handling.
- `form-builder`
  Shared form composition primitives.
- `legos`
  Reusable contract/form configuration and field definitions.
- `keychain-utils`
  Chain/network metadata, contract keychains, and validation helpers.
- `ui`
  Theme, primitives, and reusable design components.

## Data Flow

Most read-oriented flows follow this shape:

1. Route params and wallet state establish current DAO or current user context.
2. App or feature components call hooks from `src/app/hooks`, `src/features/*/hooks`, or `src/lib/dao-hooks`.
3. `src/lib/dao-hooks` handles remote query composition and shared typing.
4. TanStack Query caches results for reuse across the route tree.
5. Feature components render those results into screens and action surfaces.

The guiding rule is that reusable DAO-fetching logic belongs in `src/lib/dao-hooks`, while route-specific shaping should stay in `src/app` or the relevant feature folder.

## Transaction Flow

Most write-oriented flows follow this shape:

1. A route or feature component gathers user input.
2. Feature-specific utils translate that input into transaction args or transaction legos.
3. `TXBuilder` provides `fireTransaction` and lifecycle wiring.
4. Wallet interaction happens through the shared transaction utilities.
5. Success and error handling update local feature state, toasts, and any follow-up polling.

The Summon flow is a good reference:

- Route entry: [`src/app/routes/Summon.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/routes/Summon.tsx:1)
- Form and feature UI: [`src/features/summon/components/SummonerForm.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/components/SummonerForm.tsx:1)
- Tx assembly: [`src/features/summon/utils/transactions.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/utils/transactions.ts:1)
- Shared execution layer: [`src/lib/tx-builder/TXBuilder.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/tx-builder/TXBuilder.tsx:1)

## Dependency Guardrails

- Prefer feature-local code first when behavior is specific to one user-facing area.
- Promote code into `src/lib` only when it is genuinely reusable across features or routes.
- Keep `src/app` focused on routing, shell layout, and app-wide concerns.
- Prefer public entrypoints and barrels such as `@/lib/dao-hooks` when they exist.
- Avoid feature-to-feature imports when a shared abstraction in `src/lib` would be clearer.

## Common Starting Points

- Add or change a route:
  start with [`src/router.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/router.tsx:1) and the relevant file in [`src/app/routes`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/routes/Summon.tsx:1)
- Add shared DAO data fetching:
  start in [`src/lib/dao-hooks`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/index.ts:1)
- Add a tx-enabled action:
  inspect the relevant feature folder plus [`src/lib/tx-builder`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/tx-builder/index.ts:1)
- Add app-wide shell behavior:
  start in [`src/app/layouts`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/layouts/DaoContainer.tsx:1)

## Related Local Docs

- [`src/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/AGENT.md:1)
- [`src/app/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/AGENT.md:1)
- [`src/lib/dao-hooks/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/AGENT.md:1)
- [`src/features/summon/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/AGENT.md:1)
- [`src/features/proposal/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/AGENT.md:1)
- [`src/features/member/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/member/AGENT.md:1)
