# Legos Guide

## Purpose

`src/lib/legos` owns reusable DAO form, field, contract, and transaction definitions used by proposal creation and shared DAO workflows.

This folder describes product-level building blocks. Generic form rendering belongs in `src/lib/form-builder`, and transaction execution belongs in `src/lib/tx-builder`.

## Key Entry Points

- Public exports: [`index.ts`](index.ts)
- Form catalogs and lookup:
  [`form.ts`](form.ts)
- Field lego catalog:
  [`fields.ts`](fields.ts)
- Transaction lego catalog:
  [`tx.ts`](tx.ts)
- Contract lego catalog:
  [`contracts.ts`](contracts.ts)
- App field lookup:
  [`config.ts`](config.ts)
- Custom field components:
  [`fields/`](fields/index.ts)

## Common Tasks

- Add or change a proposal type:
  update `form.ts` and the matching transaction lego in `tx.ts`
- Add a reusable field definition:
  start in `fields.ts`; add a component under `fields/` only when core form-builder fields are not enough
- Register a custom field component:
  update `fields/fieldConfig.ts`, then make sure `AppFieldLookup` still exposes it
- Change Safe-backed proposal options:
  inspect `form.ts`, `tx.ts`, and `fields/SafeSelect.tsx`

## Guardrails

- Keep these definitions reusable across routes and features.
- Keep raw form rendering mechanics in `@/lib/form-builder`.
- Keep tx execution, polling, argument processing, and decoding in `@/lib/tx-builder`.
- Prefer imports from `@/lib/legos` for exported catalogs and types.
- Avoid placing one-off route state in form or tx legos; pass runtime values through form values, `defaultValues`, or `TXBuilder` app state.

## Related Areas

- Form rendering engine: [`../form-builder/AGENT.md`](../form-builder/AGENT.md)
- Transaction execution engine: [`../tx-builder/AGENT.md`](../tx-builder/AGENT.md)
- Proposal creation and action flows: [`../../features/proposal/AGENT.md`](../../features/proposal/AGENT.md)
- Summon form flow: [`../../features/summon/AGENT.md`](../../features/summon/AGENT.md)
- Safe proposal entrypoints: [`../../features/safe/AGENT.md`](../../features/safe/AGENT.md)
