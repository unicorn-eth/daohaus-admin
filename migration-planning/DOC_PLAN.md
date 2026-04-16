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

---

## Implementation Status

The first documentation iteration has now been completed and expanded slightly beyond the original minimum scope.

### Completed

Added higher-level documentation:

- `README.md`
- `docs/ARCHITECTURE.md`

Added local navigation docs:

- `src/AGENT.md`
- `src/app/AGENT.md`
- `src/lib/dao-hooks/AGENT.md`
- `src/features/summon/AGENT.md`
- `src/features/proposal/AGENT.md`
- `src/features/member/AGENT.md`

### What Was Covered

The current docs now provide:

- top-level local setup and environment guidance in `README.md`
- a high-level system map in `docs/ARCHITECTURE.md`
- source-level ownership guidance in `src/AGENT.md`
- app shell and routing guidance in `src/app/AGENT.md`
- shared DAO query/data access guidance in `src/lib/dao-hooks/AGENT.md`
- feature-local guidance for the summon, proposal, and member areas

This means the repo now has both:

- high-level documentation for humans and agents to understand the application as a system
- local `AGENT.md` files for task-specific navigation near the code being edited

### Notes

This work intentionally stayed lightweight:

- docs are short and operational rather than exhaustive
- the rollout focused on stable, high-value folders first
- tiny leaf folders were still avoided

---

## Next Steps

Recommended next documentation pass:

1. Add `src/lib/tx-builder/AGENT.md`
2. Add `src/lib/legos/AGENT.md`
3. Consider `src/lib/form-builder/AGENT.md` if proposal and summon work continues to rely on it heavily
4. Add feature guides for `src/features/settings/` and `src/features/safe/` if those areas are active soon
5. Optionally add `src/features/dao/AGENT.md` if DAO-specific wrapper hooks and shared DAO feature logic continue to grow

### Why These Are Next

These areas are the highest-leverage remaining gaps because they are shared infrastructure or active feature surfaces that multiple routes depend on:

- `tx-builder` explains transaction execution, lifecycle hooks, and shared write flows
- `legos` explains reusable proposal and summon form definitions
- `form-builder` explains how form configs become rendered flows
- `settings` and `safe` are meaningful user-facing areas with enough surface area to justify local docs

### Suggested Order

If continuing in small PRs, the next practical sequence is:

1. `src/lib/tx-builder/AGENT.md`
2. `src/lib/legos/AGENT.md`
3. `src/features/settings/AGENT.md`

That would round out the most important shared transaction and form infrastructure before expanding further into lower-priority feature folders.
