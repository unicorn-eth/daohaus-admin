# Home Feature Guide

## Purpose

`src/features/home` owns the connected home dashboard for browsing DAOs associated with the connected wallet.

This folder should contain home-specific list presentation, filtering, sorting, and connected-dashboard UI. Shared DAO fetching belongs in `src/lib/dao-hooks`, and route shell behavior belongs in `src/app`.

## Folder Map

- `components`
  Dashboard, list controls, cards, table rows, and disconnected-state UI
- `utils`
  Home-specific sorting and list helpers

## Key Entry Points

- Home route: [`../../app/routes/Home.tsx`](../../app/routes/Home.tsx)
- Connected dashboard: [`components/HomeDashboard.tsx`](components/HomeDashboard.tsx)
- Disconnected state: [`components/HomeNotConnected.tsx`](components/HomeNotConnected.tsx)
- List controls: [`components/ListActions.tsx`](components/ListActions.tsx)
- Card and table views:
  [`components/DaoCard.tsx`](components/DaoCard.tsx) and [`components/DaoTable.tsx`](components/DaoTable.tsx)
- Sorting config: [`utils/sorting.ts`](utils/sorting.ts)

## Common Tasks

- Change connected dashboard behavior:
  start in `components/HomeDashboard.tsx`
- Change search, sort, or view toggles:
  inspect `components/ListActions.tsx` and `utils/sorting.ts`
- Change DAO card or table display:
  inspect `components/DaoCard.tsx` and `components/DaoTable.tsx`
- Change disconnected home content:
  inspect `components/HomeNotConnected.tsx`

## Guardrails

- Keep home-dashboard-only display logic in this feature.
- Keep reusable DAO queries in `@/lib/dao-hooks`.
- Keep network name and chain conversion helpers in `@/lib/keychain-utils`.
- Keep route shell and wallet provider setup in `src/app` and `src/main.tsx`.

## Related Areas

- Shared DAO queries: [`../../lib/dao-hooks/AGENT.md`](../../lib/dao-hooks/AGENT.md)
- Network helpers: [`../../lib/keychain-utils/AGENT.md`](../../lib/keychain-utils/AGENT.md)
- App shell: [`../../app/AGENT.md`](../../app/AGENT.md)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
