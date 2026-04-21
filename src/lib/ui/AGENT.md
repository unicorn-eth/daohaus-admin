# UI Guide

## Purpose

`src/lib/ui` owns shared design primitives, theme setup, layout components, hooks, assets, and UI-facing types.

Use this folder for reusable interface building blocks. Feature-specific screens and product logic should stay in `src/features` or `src/app/routes`.

## Folder Map

- `components`
  Shared atoms, molecules, organisms, and layouts
- `theme`
  Theme provider, global tokens, atom theme config, and styled-components integration
- `hooks`
  Reusable UI hooks such as toast, debounce, media query, and copy-to-clipboard
- `types`
  Shared UI type definitions
- `assets`
  Shared UI SVG assets
- `animations`
  Reusable animation helpers

## Key Entry Points

- Public exports: [`index.ts`](index.ts)
- Theme provider: [`theme/HausThemeContext.tsx`](theme/HausThemeContext.tsx)
- Theme exports: [`theme/index.ts`](theme/index.ts)
- Component exports: [`components/index.ts`](components/index.ts)
- UI hook exports: [`hooks/index.ts`](hooks/index.ts)

## Common Tasks

- Add or change a shared component:
  add it under the appropriate `components` layer and export it from the nearest `index.ts`
- Change theme tokens or global styling:
  inspect `theme/theme.ts` and `theme/global/`
- Change toast, media-query, debounce, or copy behavior:
  inspect `hooks/`
- Change feature-specific layout:
  prefer the relevant feature or route unless the pattern is truly reusable

## Guardrails

- Keep product-specific DAO behavior out of `@/lib/ui`.
- Preserve public exports so consumers can import from `@/lib/ui`.
- Prefer existing atoms, molecules, and layouts before creating new primitives.
- Keep styling consistent with the local theme and styled-components patterns.

## Related Areas

- App shell: [`../../app/AGENT.md`](../../app/AGENT.md)
- Source guide: [`../../AGENT.md`](../../AGENT.md)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
