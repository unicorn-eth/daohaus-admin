# Source Guide

## Purpose

`src` is organized around three top-level concerns:

- `app`
  routing, layout shells, and app-level helpers
- `features`
  user-facing product areas such as proposals, summon, members, safes, and settings
- `lib`
  reusable infrastructure, data hooks, transaction utilities, UI primitives, and shared helpers

This file is the starting point when you are deciding where new code belongs.

## Where To Put New Code

- New route screens or route containers:
  `src/app/routes` or `src/app/layouts`
- Feature-specific components, hooks, and utils:
  the relevant folder under `src/features`
- Shared DAO data or query logic:
  `src/lib/dao-hooks`
- Shared transaction execution behavior:
  `src/lib/tx-builder`
- Shared form configuration or reusable field definitions:
  `src/lib/form-builder` or `src/lib/legos`
- Shared design system and theming:
  `src/lib/ui`

## Guardrails

- Prefer feature-local code before creating new shared abstractions.
- Keep route and shell concerns in `app`, not in feature folders.
- Keep reusable infrastructure in `lib`, not inside one feature.
- Avoid reaching into another feature's internals unless there is no better shared home.
- Prefer configured aliases such as `@/app`, `@/features`, `@/lib`, and `@/assets` from [`vite.config.ts`](/home/skuhl/Documents/ody/haus/haus-admin/vite.config.ts:1).

## Key Entry Points

- App bootstrapping: [`main.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/main.tsx:1)
- Route tree: [`router.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/router.tsx:1)
- System overview: [`../docs/ARCHITECTURE.md`](/home/skuhl/Documents/ody/haus/haus-admin/docs/ARCHITECTURE.md:1)

## Related Areas

- [`app/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/AGENT.md:1) for route, layout, and shell guidance
- [`lib/dao-hooks/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/AGENT.md:1) for shared DAO data access
- [`features/summon/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/AGENT.md:1) for a concrete feature example
- [`features/proposal/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/AGENT.md:1) for proposal list, detail, and action flows
- [`features/member/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/member/AGENT.md:1) for member list and profile flows
