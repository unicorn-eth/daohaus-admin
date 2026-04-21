# Verification Guide

## Purpose

Use this guide to choose verification steps before handing back a change. The repo currently has lint and build scripts, but no dedicated unit or end-to-end test script.

## Standard Commands

- `npm run lint`
  Runs ESLint across the repo. Use for most code changes.
- `npm run build`
  Runs TypeScript build checks and Vite production build. Use for most code changes.
- `npm run dev`
  Starts the Vite dev server for manual verification.
- `npm run preview`
  Serves the production build for manual smoke testing.

## By Change Type

- Docs-only change:
  review Markdown links and run a targeted search for broken absolute paths. Build is usually not necessary.
- UI component change:
  run `npm run lint` and `npm run build`; manually verify affected loading, empty, error, and normal states when possible.
- Data hook change:
  run `npm run lint` and `npm run build`; manually verify the route that consumes the hook and any reused consumers.
- Transaction flow change:
  run `npm run lint` and `npm run build`; manually inspect final tx args and verify success, error, and polling behavior where possible.
- Environment/config change:
  run `npm run build`; manually check missing-env behavior and the affected provider or integration.
- Routing change:
  run `npm run build`; manually visit new or changed routes, including direct-load and navigation paths.

## Reporting Results

When handing back work, include:

- What changed.
- Which commands ran.
- Which manual checks were done.
- Any command that could not be run.
- Remaining risk, especially when wallet, chain, or external API access was not manually verified.

## Related Docs

- Debugging guide: [`DEBUGGING.md`](DEBUGGING.md)
- Environment guide: [`ENVIRONMENT.md`](ENVIRONMENT.md)
