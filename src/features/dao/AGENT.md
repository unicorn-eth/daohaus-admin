# DAO Feature Guide

## Purpose

`src/features/dao` owns small DAO-context helpers that are feature-facing but tied to the current DAO route.

This folder should stay thin. Shared query implementations belong in `src/lib/dao-hooks`, while route param extraction belongs in `src/app/hooks`.

## Folder Map

- `hooks`
  Current-DAO convenience hooks and connected-member helpers

## Key Entry Points

- DAO data compatibility wrapper: [`hooks/useDaoData.ts`](hooks/useDaoData.ts)
- Connected member helper: [`hooks/useConnectedMember.ts`](hooks/useConnectedMember.ts)
- Current DAO route params: [`../../app/hooks/useCurrentDao.ts`](../../app/hooks/useCurrentDao.ts)
- Shared DAO query source: [`../../lib/dao-hooks/AGENT.md`](../../lib/dao-hooks/AGENT.md)

## Common Tasks

- Change how current DAO data is exposed to feature code:
  inspect `hooks/useDaoData.ts`, then the underlying hook in `@/lib/dao-hooks`
- Change connected-member behavior:
  inspect `hooks/useConnectedMember.ts`
- Change route param parsing:
  use `src/app/hooks/useCurrentDao.ts`

## Guardrails

- Do not add broad DAO fetching implementations here; use `@/lib/dao-hooks`.
- Do not duplicate route-param parsing; use `@/app/hooks/useCurrentDao`.
- Keep this folder for small feature-facing helpers, not app shell state.

## Related Areas

- Shared DAO queries: [`../../lib/dao-hooks/AGENT.md`](../../lib/dao-hooks/AGENT.md)
- App route context: [`../../app/AGENT.md`](../../app/AGENT.md)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
