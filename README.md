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

The first five variables are required by [`src/lib/env.ts`](src/lib/env.ts). `VITE_SEQUENCE_KEY` is optional. See [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for variable purpose and failure modes.

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

Routing is defined in [`src/router.tsx`](src/router.tsx). App-wide providers are assembled in [`src/main.tsx`](src/main.tsx).

## Docs Map

Start with the architecture and source guides, then read the nearest local guide for the area you are changing.

- High-level architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Debugging guide: [`docs/DEBUGGING.md`](docs/DEBUGGING.md)
- Domain glossary: [`docs/DOMAIN_GLOSSARY.md`](docs/DOMAIN_GLOSSARY.md)
- Environment guide: [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md)
- Verification guide: [`docs/VERIFICATION.md`](docs/VERIFICATION.md)
- Source navigation guide: [`src/AGENT.md`](src/AGENT.md)
- App shell guide: [`src/app/AGENT.md`](src/app/AGENT.md)
- Shared DAO hooks guide: [`src/lib/dao-hooks/AGENT.md`](src/lib/dao-hooks/AGENT.md)
- Transaction builder guide: [`src/lib/tx-builder/AGENT.md`](src/lib/tx-builder/AGENT.md)
- Form builder guide: [`src/lib/form-builder/AGENT.md`](src/lib/form-builder/AGENT.md)
- Legos guide: [`src/lib/legos/AGENT.md`](src/lib/legos/AGENT.md)
- Home feature guide: [`src/features/home/AGENT.md`](src/features/home/AGENT.md)
- DAO feature guide: [`src/features/dao/AGENT.md`](src/features/dao/AGENT.md)
- Summon feature guide: [`src/features/summon/AGENT.md`](src/features/summon/AGENT.md)
- Proposal feature guide: [`src/features/proposal/AGENT.md`](src/features/proposal/AGENT.md)
- Member feature guide: [`src/features/member/AGENT.md`](src/features/member/AGENT.md)
- Safe feature guide: [`src/features/safe/AGENT.md`](src/features/safe/AGENT.md)
- Settings feature guide: [`src/features/settings/AGENT.md`](src/features/settings/AGENT.md)
- UI guide: [`src/lib/ui/AGENT.md`](src/lib/ui/AGENT.md)
- Keychain/network guide: [`src/lib/keychain-utils/AGENT.md`](src/lib/keychain-utils/AGENT.md)
