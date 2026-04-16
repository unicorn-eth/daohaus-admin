# Summon Feature Guide

## Purpose

`src/features/summon` owns the DAO creation experience rendered by the `/summon` route.

This folder covers summon-specific form composition, validation, feature state transitions, and transaction argument assembly. Shared wallet, network, transaction, and UI infrastructure should stay in `src/lib`.

## Key Entry Points

- Route entry: [`../../app/routes/Summon.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/routes/Summon.tsx:1)
- Main form: [`components/SummonerForm.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/components/SummonerForm.tsx:1)
- UI states:
  `SummonerLoading.tsx`, `SummonerSuccess.tsx`, and `SummonError.tsx`
- Form keys: [`utils/formKeys.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/utils/formKeys.ts:1)
- Validation and normalization:
  [`utils/validation.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/utils/validation.ts:1)
- Tx assembly:
  [`utils/transactions.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/utils/transactions.ts:1)

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

- Shared tx execution: [`../../lib/tx-builder/TXBuilder.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/tx-builder/TXBuilder.tsx:1)
- Network and contract helpers: [`../../lib/keychain-utils/index.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/keychain-utils/index.ts:1)
- Shared form and field building: [`../../lib/legos/index.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/legos/index.ts:1)
- System overview: [`../../../../docs/ARCHITECTURE.md`](/home/skuhl/Documents/ody/haus/haus-admin/docs/ARCHITECTURE.md:1)
