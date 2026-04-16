# HAUS Admin

HAUS Admin is a Vite + React application for browsing and administering DAOhaus Moloch V3 DAOs. The app combines route-based screens, shared DAO data hooks, and transaction-building utilities for actions like summoning, proposal workflows, member views, safes, and settings.

## Local Setup

Requirements:

- Node `20.19.5`
- npm `11.7.0`

Install dependencies:

```bash
npm install
```

Create a local `.env` file with:

```bash
VITE_WALLET_CONNECT_ID=
VITE_GRAPH_API_KEY=
VITE_ALCHEMY_KEY=
VITE_ETHERSCAN_KEY=
VITE_GNOSIS_SAFE_API_KEY=
VITE_SEQUENCE_KEY=
```

The first five variables are required by [`src/lib/env.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/env.ts:1). `VITE_SEQUENCE_KEY` is optional.

Start the dev server:

```bash
npm run dev
```

Other useful commands:

```bash
npm run build
npm run lint
npm run preview
```

## Project Shape

- `src/app` contains route entrypoints, layouts, and app-shell concerns.
- `src/features` contains user-facing domain areas such as `proposal`, `summon`, `member`, and `settings`.
- `src/lib` contains reusable infrastructure such as DAO data hooks, transaction building, form composition, network utilities, and UI primitives.

Routing is defined in [`src/router.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/router.tsx:1). App-wide providers are assembled in [`src/main.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/main.tsx:1).

## Docs

- High-level architecture: [`docs/ARCHITECTURE.md`](/home/skuhl/Documents/ody/haus/haus-admin/docs/ARCHITECTURE.md:1)
- Source navigation guide: [`src/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/AGENT.md:1)
- App shell guide: [`src/app/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/AGENT.md:1)
- Shared DAO hooks guide: [`src/lib/dao-hooks/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/AGENT.md:1)
- Summon feature guide: [`src/features/summon/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/AGENT.md:1)
- Proposal feature guide: [`src/features/proposal/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/AGENT.md:1)
- Member feature guide: [`src/features/member/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/member/AGENT.md:1)
