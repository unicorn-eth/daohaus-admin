# Form Builder Guide

## Purpose

`src/lib/form-builder` owns the reusable form rendering engine built around form legos, field legos, React Hook Form, validation rules, and shared form layout behavior.

This folder should know how to render and submit a lego form. Product-specific field catalogs and DAO transaction definitions belong in `src/lib/legos`.

## Key Entry Points

- Public exports: [`index.ts`](index.ts)
- Tx-aware form wrapper:
  [`FormBuilder.tsx`](FormBuilder.tsx)
- Base renderer and form context:
  [`base/FormBuilderBase.tsx`](base/FormBuilderBase.tsx)
- Field factory:
  [`base/components/FormBuilderFactory.tsx`](base/components/FormBuilderFactory.tsx)
- Core field lookup:
  [`components/CoreFieldLookup.ts`](components/CoreFieldLookup.ts)
- Validation rules:
  [`base/utils/rules.ts`](base/utils/rules.ts)
- Shared form and field types:
  [`types/`](types/index.ts) and [`base/utils/types.ts`](base/utils/types.ts)

## Common Tasks

- Change generic field rendering:
  start in `base/components/FormBuilderFactory.tsx`
- Add a core reusable field type:
  add the component under `components/`, export it from `components/index.ts`, and register it in `components/CoreFieldLookup.ts`
- Change validation behavior:
  inspect `base/utils/rules.ts`
- Change submit status or tx lifecycle copy:
  inspect `FormBuilder.tsx` and `components/formFooter.tsx`
- Add DAO-specific fields:
  prefer `src/lib/legos/fields` unless the field is truly generic

## Guardrails

- Keep DAO-specific field names, proposal types, and contract behavior out of this folder.
- Keep this package reusable by passing product fields through `fieldObj` or `customFields`.
- Use `FormBuilder` when the form may execute a tx through `TXBuilder`; use `FormBuilderBase` for lower-level rendering.
- Avoid deep imports when public exports from `@/lib/form-builder` are enough.

## Related Areas

- DAO form and field catalogs: [`../legos/AGENT.md`](../legos/AGENT.md)
- Transaction execution: [`../tx-builder/AGENT.md`](../tx-builder/AGENT.md)
- Proposal form flows: [`../../features/proposal/AGENT.md`](../../features/proposal/AGENT.md)
- Summon form flow: [`../../features/summon/AGENT.md`](../../features/summon/AGENT.md)
- Safe add form: [`../../features/safe/AGENT.md`](../../features/safe/AGENT.md)
