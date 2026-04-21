# Transaction Builder Guide

## Purpose

`src/lib/tx-builder` owns shared transaction preparation, execution, lifecycle callbacks, argument processing, decoding, and polling.

This folder should stay route-agnostic. Feature code should describe what transaction to run with tx legos, then execute it through `TXBuilder` or `useTxBuilder`.

## Key Entry Points

- Public exports: [`index.ts`](index.ts)
- Provider and hook: [`TXBuilder.tsx`](TXBuilder.tsx)
- Transaction preparation and execution:
  [`utils/txBuilderUtils.ts`](utils/txBuilderUtils.ts)
- Arg, contract, override, and multicall processing:
  [`utils/args.ts`](utils/args.ts), [`utils/contractHelpers.ts`](utils/contractHelpers.ts), [`utils/overrides.ts`](utils/overrides.ts), and [`utils/multicall.ts`](utils/multicall.ts)
- Decode helpers:
  [`utils/decoding.ts`](utils/decoding.ts) and [`utils/deepDecoding.ts`](utils/deepDecoding.ts)

## Common Tasks

- Add a new reusable transaction shape:
  usually start in `src/lib/legos/tx.ts`, then use this package only for generic builder behavior
- Change transaction lifecycle behavior:
  inspect `TXBuilder.tsx`, `utils/lifeCycleFns.ts`, and `utils/txBuilderUtils.ts`
- Change how tx arguments are resolved from app or form state:
  start in `utils/args.ts`
- Change multicall encoding:
  start in `utils/multicall.ts`
- Change decoded transaction displays:
  inspect decode helpers here, then the consuming feature display in `src/features/proposal`

## Guardrails

- Keep feature-specific form values and proposal semantics out of this folder.
- Prefer importing from `@/lib/tx-builder` instead of deep utility paths when the public export covers the need.
- Keep wallet, chain, and keychain metadata in `@/lib/keychain-utils` unless the code is specifically transaction assembly behavior.
- Keep tx lego definitions in `@/lib/legos`; this package should execute and decode them.

## Related Areas

- Shared tx and form definitions: [`../legos/AGENT.md`](../legos/AGENT.md)
- Shared form runner: [`../form-builder/AGENT.md`](../form-builder/AGENT.md)
- Proposal action and decode UI: [`../../features/proposal/AGENT.md`](../../features/proposal/AGENT.md)
- Summon transaction assembly: [`../../features/summon/AGENT.md`](../../features/summon/AGENT.md)
