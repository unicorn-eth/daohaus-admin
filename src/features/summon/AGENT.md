# Summon Feature Guide

## Purpose

`src/features/summon` owns the DAO creation experience rendered by the `/summon` route.

This folder covers summon-specific form composition, validation, feature state transitions, and transaction argument assembly. Shared wallet, network, transaction, and UI infrastructure should stay in `src/lib`.

## Key Entry Points

- Route entry: [`../../app/routes/Summon.tsx`](../../app/routes/Summon.tsx)
- Main form: [`components/SummonerForm.tsx`](components/SummonerForm.tsx)
- UI states:
  `SummonerLoading.tsx`, `SummonerSuccess.tsx`, and `SummonError.tsx`
- Form keys: [`utils/formKeys.ts`](utils/formKeys.ts)
- Validation and normalization:
  [`utils/validation.ts`](utils/validation.ts)
- Tx assembly:
  [`utils/transactions.ts`](utils/transactions.ts)

## Common Tasks

- Change the summon flow state machine:
  start in `src/app/routes/Summon.tsx` and `components/SummonerForm.tsx`
- Add or adjust form fields:
  update the relevant segment component and keep `FORM_KEYS` aligned
- Change encoded summon transaction behavior:
  start in `utils/transactions.ts`
- Change supported-network behavior or chain copy:
  inspect the route plus `@/lib/keychain-utils`

## Guardrails

- Keep summon-specific behavior here even if it spans several components.
- Reusable network validation or contract metadata belongs in `@/lib/keychain-utils`.
- Reusable transaction execution behavior belongs in `@/lib/tx-builder`.
- Reusable field definitions or form legos belong in `@/lib/legos` or `@/lib/form-builder`.

## Related Areas

- Shared tx execution: [`../../lib/tx-builder/TXBuilder.tsx`](../../lib/tx-builder/TXBuilder.tsx)
- Network and contract helpers: [`../../lib/keychain-utils/index.ts`](../../lib/keychain-utils/index.ts)
- Shared form and field building: [`../../lib/legos/index.ts`](../../lib/legos/index.ts)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
