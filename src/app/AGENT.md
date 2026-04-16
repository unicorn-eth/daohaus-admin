# App Shell Guide

## Purpose

`src/app` owns route entrypoints, layout containers, and app-level helpers that are broader than any single feature.

This folder does not own most business logic for proposals, members, safes, or settings. That logic should stay in `src/features/*` unless it is truly shared infrastructure.

## Folder Map

- `routes`
  route entry files used by the router
- `layouts`
  shell containers such as `HomeContainer` and `DaoContainer`
- `hooks`
  app-level hooks tied to route context, profile state, or shell behavior
- `components`
  app-wide composition helpers and shell UI, not feature-specific screens

## Key Entry Points

- Router definition lives in [`../router.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/router.tsx:1)
- Home shell starts in [`layouts/HomeContainer.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/layouts/HomeContainer.tsx:1)
- DAO shell starts in [`layouts/DaoContainer.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/layouts/DaoContainer.tsx:1)
- Route-derived DAO context helper lives in [`hooks/useCurrentDao.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/hooks/useCurrentDao.ts:1)

## Common Tasks

- Add a new page under the home or DAO shell:
  add a route file in `routes`, then register it in `src/router.tsx`
- Change top-level navigation or shell layout:
  start in `layouts/AppLayout.tsx` and the relevant container
- Add behavior that depends on route params and is reused across features:
  consider `app/hooks`

## Guardrails

- `routes` should stay thin when possible and hand off feature-specific UI to `src/features/*`.
- `layouts` should own shell context and cross-feature wrappers such as `TXBuilder`.
- Do not move reusable DAO fetching into `app`; prefer `@/lib/dao-hooks`.
- Do not place feature-specific components here just because they are rendered by a route.

## Related Areas

- [`../AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/AGENT.md:1)
- [`../lib/dao-hooks/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/AGENT.md:1)
- [`../features/summon/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/summon/AGENT.md:1)
