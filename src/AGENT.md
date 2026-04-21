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
- Prefer configured aliases such as `@/app`, `@/features`, `@/lib`, and `@/assets` from [`vite.config.ts`](../vite.config.ts).

## Key Entry Points

- App bootstrapping: [`main.tsx`](main.tsx)
- Route tree: [`router.tsx`](router.tsx)
- System overview: [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- Debugging guide: [`../docs/DEBUGGING.md`](../docs/DEBUGGING.md)
- Verification guide: [`../docs/VERIFICATION.md`](../docs/VERIFICATION.md)

## Related Areas

- [`app/AGENT.md`](app/AGENT.md) for route, layout, and shell guidance
- [`lib/dao-hooks/AGENT.md`](lib/dao-hooks/AGENT.md) for shared DAO data access
- [`lib/tx-builder/AGENT.md`](lib/tx-builder/AGENT.md) for transaction execution
- [`lib/form-builder/AGENT.md`](lib/form-builder/AGENT.md) for reusable form rendering
- [`lib/legos/AGENT.md`](lib/legos/AGENT.md) for DAO form, field, and tx definitions
- [`features/home/AGENT.md`](features/home/AGENT.md) for the connected dashboard
- [`features/dao/AGENT.md`](features/dao/AGENT.md) for current DAO helpers
- [`features/summon/AGENT.md`](features/summon/AGENT.md) for DAO creation
- [`features/proposal/AGENT.md`](features/proposal/AGENT.md) for proposal list, detail, and action flows
- [`features/member/AGENT.md`](features/member/AGENT.md) for member list and profile flows
- [`features/safe/AGENT.md`](features/safe/AGENT.md) for vault and Safe flows
- [`features/settings/AGENT.md`](features/settings/AGENT.md) for DAO settings display and update flows
- [`lib/ui/AGENT.md`](lib/ui/AGENT.md) for design system and shared UI
- [`lib/keychain-utils/AGENT.md`](lib/keychain-utils/AGENT.md) for network and contract metadata
