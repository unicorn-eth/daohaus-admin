# Documentation And `AGENT.md` Plan

**Goal:** Add lightweight local documentation that helps developers and LLM agents navigate the codebase quickly without introducing large, stale docs.

**Date:** April 14, 2026

---

## Why Add `AGENT.md` Files

The repo now has a clearer structure:

```text
src/
  app/
  features/
  lib/
```

This makes it a good fit for local documentation files because each folder now has a more stable responsibility.

Short `AGENT.md` files can help answer:

- What belongs in this folder?
- What are the important entrypoints?
- What should not be imported directly?
- If I need related logic, where should I look next?

For LLM agents, this is especially useful because it reduces search noise and gives task-local context near the code being edited.

---

## Documentation Principles

Each `AGENT.md` should be:

- short
- operational
- local to the folder
- easy to scan
- focused on structure and workflow, not long-form architecture essays

Each file should avoid:

- duplicating large amounts of README content
- describing every file in detail
- embedding change logs
- documenting unstable implementation details unless they affect navigation

---

## Recommended Rollout Order

### Phase A - Root guidance

Create:

- `src/AGENT.md`

Purpose:

- explain the meaning of `app`, `features`, and `lib`
- define import and ownership rules at a high level
- explain where new files should go

### Phase B - App shell guidance

Create:

- `src/app/AGENT.md`

Purpose:

- describe `components`, `hooks`, `layouts`, and `routes`
- explain route/layout relationships
- clarify that `app` is for shell concerns, not feature business logic

### Phase C - Shared library guidance

Create:

- `src/lib/AGENT.md`
- `src/lib/dao-hooks/AGENT.md`

Purpose:

- explain shared infrastructure expectations
- define public surfaces versus internals
- state whether consumers should import from package barrels or internal files

### Phase D - Feature guidance

Start with the most important or most complex features:

- `src/features/proposal/AGENT.md`
- `src/features/summon/AGENT.md`
- `src/features/member/AGENT.md`

Then expand if helpful:

- `src/features/home/AGENT.md`
- `src/features/safe/AGENT.md`
- `src/features/settings/AGENT.md`
- `src/features/dao/AGENT.md`

---

## Suggested Template

Recommended structure for each `AGENT.md`:

```md
# <Area Name>

## Purpose
- What this folder owns
- What it does not own

## Key Entry Points
- Important files or barrels
- Main route/layout/component/hook entrypoints

## Common Tasks
- If editing X, start here
- If adding Y, place it here

## Related Areas
- Closest neighboring folders and why they matter

## Guardrails
- Public import boundaries
- Avoid direct imports from internal files if applicable
```

---

## Proposed Content By Area

### `src/AGENT.md`

Should include:

- architecture overview for `app`, `features`, `lib`
- where to place new components, hooks, and utils
- alias guidance
- note that feature-local code should prefer colocated `components`, `hooks`, and `utils`

### `src/app/AGENT.md`

Should include:

- `routes` are route entrypoints
- `layouts` are app-shell containers
- `hooks` are app-level concerns like route-derived context or wallet/profile helpers
- `components` are app-wide shared UI composition, not feature-specific screens

### `src/lib/dao-hooks/AGENT.md`

Should include:

- this folder owns shared DAO data/query primitives
- these hooks should remain reusable and route-agnostic
- app-specific wrappers belong in `src/features/dao/hooks` or `src/app/hooks`
- prefer imports from `@/lib/dao-hooks` instead of deep internal paths where possible

### `src/features/proposal/AGENT.md`

Should include:

- proposal detail/list/actions/action-data ownership
- where proposal status display logic lives
- where transaction actions live versus read-only displays
- related areas:
  `src/lib/dao-hooks`, `src/lib/legos`, `src/features/member`

### `src/features/summon/AGENT.md`

Should include:

- summon route flow
- component entrypoints
- where form keys, validation, and tx assembly live
- related areas:
  `src/lib/legos`, `src/lib/tx-builder`, `src/lib/keychain-utils`

---

## What To Avoid

Do not add `AGENT.md` files to every folder immediately.

That would create more maintenance burden than value.

Prefer adding them only where:

- the folder has a stable responsibility
- a developer or agent would genuinely save time from local context
- there are enough files or relationships to justify guidance

Good candidates:

- `src/`
- `src/app/`
- `src/lib/dao-hooks/`
- `src/features/proposal/`
- `src/features/summon/`

Lower-value candidates right now:

- tiny leaf folders with one or two files
- folders whose purpose is already obvious from names alone

---

## Success Criteria

This documentation strategy is working if:

- a new developer can find the right area to edit with minimal repo scanning
- an LLM agent can infer ownership from folder structure plus one nearby `AGENT.md`
- fewer imports cross layers accidentally
- feature work starts from feature folders instead of shared library internals

---

## Recommended First Documentation PR

Start small:

1. Add `src/AGENT.md`
2. Add `src/app/AGENT.md`
3. Add `src/lib/dao-hooks/AGENT.md`
4. Add `src/features/summon/AGENT.md` as the first feature example

This gives the repo a strong pattern without overcommitting to a large documentation surface.
