# Environment Guide

## Purpose

This app reads Vite environment variables through [`src/lib/env.ts`](../src/lib/env.ts). Missing required variables are surfaced by [`src/app/components/EnvWarning.tsx`](../src/app/components/EnvWarning.tsx).

Copy `.env.example` to `.env` and fill in local values before running the app.

## Variables

- `VITE_WALLET_CONNECT_ID`
  Required. Used by wallet connection setup. If missing, wallet connection UI may fail or behave unpredictably.
- `VITE_GRAPH_API_KEY`
  Required. Passed into `DaoHooksProvider` for DAO graph data. If missing, DAO, proposal, member, Safe, and home dashboard data may fail to load.
- `VITE_ALCHEMY_KEY`
  Required. Used by network/RPC-related setup. If missing, wallet or chain reads may fail depending on the network path.
- `VITE_ETHERSCAN_KEY`
  Required. Used for explorer or contract-related integrations. If missing, explorer-backed metadata or verification-related helpers may fail.
- `VITE_GNOSIS_SAFE_API_KEY`
  Required. Used for Safe-related API access. If missing, Safe balances or Safe metadata can fail.
- `VITE_SEQUENCE_KEY`
  Optional. Used only by integrations that need Sequence configuration.

## Common Failure Modes

- Missing env warning appears:
  check `src/lib/env.ts` for the required variable list and confirm `.env` is loaded by Vite.
- DAO data fails across multiple pages:
  check `VITE_GRAPH_API_KEY` first.
- Wallet connection fails before app data loads:
  check `VITE_WALLET_CONNECT_ID` and the wagmi/RainbowKit setup.
- Safe pages fail while other DAO pages work:
  check `VITE_GNOSIS_SAFE_API_KEY` and Safe network support.
- Network-specific behavior fails:
  check `VITE_ALCHEMY_KEY`, `src/lib/wagmi-config.ts`, and `src/lib/keychain-utils`.

## Related Files

- Example env file: [`../.env.example`](../.env.example)
- Env parser: [`../src/lib/env.ts`](../src/lib/env.ts)
- App provider setup: [`../src/main.tsx`](../src/main.tsx)
- Network guide: [`../src/lib/keychain-utils/AGENT.md`](../src/lib/keychain-utils/AGENT.md)
