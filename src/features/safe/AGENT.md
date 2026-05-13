# Safe Feature Guide

## Purpose

`src/features/safe` owns Safe-focused UI for DAO vault display, Safe balance summaries, adding linked Safes, and Safe-specific proposal shortcuts.

This folder should hold Safe feature presentation and interactions. Shared DAO fetching belongs in `src/lib/dao-hooks`, shared Safe or chain metadata belongs in `src/lib/keychain-utils`, and proposal form definitions belong in `src/lib/legos`.

## Key Entry Points

- Safes route: [`../../app/routes/Safes.tsx`](../../app/routes/Safes.tsx)
- Add Safe form:
  [`components/AddSafeForm.tsx`](components/AddSafeForm.tsx)
- Safe overview card:
  [`components/SafeCard.tsx`](components/SafeCard.tsx)
- Safe proposal shortcuts:
  [`components/SafeActionMenu.tsx`](components/SafeActionMenu.tsx)
- Safe balance hook:
  [`hooks/useSafeBalances.ts`](hooks/useSafeBalances.ts)

## Common Tasks

- Change Safe list loading, empty, or dialog behavior:
  start in `src/app/routes/Safes.tsx`
- Change Safe balance display:
  inspect `components/SafeCard.tsx`
- Change Safe balance fetching:
  inspect `hooks/useSafeBalances.ts` and `@/lib/dao-hooks`
- Change add-Safe behavior:
  inspect `components/AddSafeForm.tsx`, `src/lib/legos/form.ts`, and `src/lib/legos/tx.ts`
- Change Safe proposal shortcut links:
  inspect `components/SafeActionMenu.tsx` and matching form legos in `@/lib/legos`

## Guardrails

- Keep Safe-specific display and shortcut behavior in this feature.
- Keep route layout and dialog placement in `src/app/routes/Safes.tsx`.
- Keep shared DAO or vault queries in `@/lib/dao-hooks`.
- Keep reusable form and tx definitions in `@/lib/legos`.
- Keep transaction execution details in `@/lib/tx-builder`.

## Related Areas

- Shared DAO and vault data: [`../../lib/dao-hooks/index.ts`](../../lib/dao-hooks/index.ts)
- Shared form definitions: [`../../lib/legos/AGENT.md`](../../lib/legos/AGENT.md)
- Shared form rendering: [`../../lib/form-builder/AGENT.md`](../../lib/form-builder/AGENT.md)
- Shared tx execution: [`../../lib/tx-builder/AGENT.md`](../../lib/tx-builder/AGENT.md)
- Route DAO context: [`../../app/hooks/useCurrentDao.ts`](../../app/hooks/useCurrentDao.ts)
