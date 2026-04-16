# DAO Hooks Guide

## Purpose

`src/lib/dao-hooks` owns shared DAO data access, query composition, and shared DAO-facing types.

This folder is the right home for reusable hooks that fetch DAO, proposal, member, token, exit, or record data across multiple routes or features.

## Key Entry Points

- Public exports: [`index.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/index.ts:1)
- Provider and config context: [`DaoHooksContext.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/DaoHooksContext.tsx:1)
- Hook implementations: [`hooks/`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/hooks/useDao.ts:1)
- Shared query/types utilities: [`utils/`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/utils/queries.ts:1)

## Common Tasks

- Add a new reusable DAO query:
  create or extend a hook in `hooks/` and export it from `index.ts`
- Update shared graph configuration behavior:
  start in `DaoHooksContext.tsx`
- Update shared query fragments or endpoint construction:
  inspect `utils/queries.ts` and `utils/endpoints.ts`

## Guardrails

- Keep hooks route-agnostic when possible.
- Keep app-specific shaping out of this folder; wrappers that depend on one route or screen belong in `src/app/hooks` or a feature hook.
- Prefer imports from `@/lib/dao-hooks` instead of deep internal paths when consuming these hooks.
- Shared types that travel with DAO hook results should live here rather than being redefined in features.

## Related Areas

- [`../../app/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/AGENT.md:1) for route-level consumers
- [`../../features/summon/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/AGENT.md:1) for a tx-heavy feature example
- [`../../../../docs/ARCHITECTURE.md`](/home/skuhl/Documents/ody/haus/haus-admin/docs/ARCHITECTURE.md:1) for system-level flow
