# haus-admin — Post Migration Plan

## Purpose

Phase 6 in [PLAN.md](/home/skuhl/Documents/ody/haus/haus-admin/PLAN.md) closes out migration work, but it does not yet fully address the longer-term goal: make the admin stack much easier to understand, maintain, and support.

This plan picks up after the app is functionally working and focuses on reducing technical surface area across the repository.

## Fresh-Eyes Read

The current modernization plan is strong at feature parity, but the work after Phase 6 should be reframed around supportability rather than more porting.

Three themes stand out:

1. `haus-admin` is now the active app, but the repository still reads like a migration workspace rather than a settled product structure.
2. The active app still carries legacy runtime surface from the old architecture, especially around token balances and WalletConnect proposal flows.
3. The copied-local-lib strategy succeeded for delivery speed, but it now needs a second pass to define ownership, prune dead code, and document what is truly active vs. preserved for reference only.

## Current Risks Worth Addressing First

- `useDaoTokenBalances` in [useDaoTokenBalances.ts](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/hooks/useDaoTokenBalances.ts) still depends on `@0xsequence/indexer`. This is now an intentional short-term choice because the Gnosis Safe API hit rate limits too quickly for the current budget and usage profile.
- WalletConnect proposal fields in [WalletConnectLink.tsx](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/legos/fields/WalletConnectLink.tsx) and [walletConnectV2.tsx](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/legos/fields/walletConnectV2.tsx) still pull `@walletconnect/web3wallet`, which is one of the more complex support surfaces in the active app.
- `haus-admin` currently bundles many locally ported libraries under `src/lib/`, but there is not yet a clear distinction between:
  - active runtime code
  - copied compatibility code
  - legacy reference code that should not keep evolving
- The repository root still presents three major codebases (`haus-admin`, `haus-dao-hooks`, `monorepo`) without making it explicit that only `haus-admin` remains active and maintained.

## Desired End State

The repository should make these facts obvious:

- `haus-admin/` is the active application.
- `monorepo/` is deprecated and preserved for reference only.
- `haus-dao-hooks/` is deprecated and preserved for reference only.
- The active app avoids legacy SDK dependencies unless they are unavoidable and intentionally owned.
- New contributors can tell within minutes where to work, what not to touch, and which packages are considered deprecated.

## Recommended Workstreams

### 1. Define the Repository Contract

Create a simple top-level support policy before more cleanup work.

Deliverables:

- Root `README.md` describing active vs. deprecated codebases.
- A short status file for each top-level project:
  - `haus-admin`: active
  - `monorepo`: deprecated / reference only
  - `haus-dao-hooks`: deprecated / reference only
- A root architecture note that explains why `src/lib/` exists and that `haus-admin` is now the only maintained system.

### 2. Consolidate the Active Surface Area

Reduce the number of places where “real app logic” can live.

Deliverables:

- Inventory every directory under `haus-admin/src/lib/` and label it:
  - core active
  - active but compatibility-shaped
  - candidate for deletion
- Move toward a structure that separates app-owned code from imported legacy internals.

Suggested target shape:

```text
haus-admin/
  src/
    app/              # routes, pages, providers, app wiring
    components/       # app-specific UI
    features/         # proposals, members, safes, settings, summon
    shared/           # utilities, hooks, types, design primitives used by app code
    legacy/           # copied code intentionally preserved during transition
```

Notes:

- This does not need to happen in one large refactor.
- The main benefit is making legacy carryover visible instead of blending it into normal application code.

### 3. Remove Legacy SDK Dependencies From Active Paths

This should be the highest-value technical cleanup track.

Priority items:

1. Reassess WalletConnect proposal support and either simplify or isolate it.
2. Reduce duplicate low-level blockchain/client abstractions where possible.
3. Keep Sequence-based balance fetching stable while documenting the conditions for a future Safe API migration.

Concrete next steps:

- Audit whether WalletConnect proposal flows are still strategically important.
- If WalletConnect proposals are required, isolate them behind a single feature boundary and document them as a special-case subsystem.
- If WalletConnect proposals are not critical, de-scope them from the active app and preserve the old implementation as deprecated reference code.
- Keep `useDaoTokenBalances` as the default active balance path for now.
- Reduce unnecessary balance refetching and duplicate calls so the current Sequence approach stays cost-effective and operationally simple.

Recommendation:

- Treat WalletConnect proposal support as a product decision, not just a dependency cleanup task. Its support cost is likely outsized relative to how often it is used.
- Treat Safe API migration as an operational decision, not just a technical cleanup task. Free-plan rate limits make it a poor default unless usage patterns, caching, or paid capacity change.

### 4. Rationalize Local Libraries

The copied libraries were the right migration move. They are now the main complexity multiplier.

Deliverables:

- For each local library under `src/lib/`, assign one of these statuses:
  - keep and actively own
  - flatten into app code
  - freeze as compatibility layer
  - delete after replacement

Suggested outcomes:

- `dao-hooks`: the active code lives inside `haus-admin`; the standalone `haus-dao-hooks/` repo is preserved only as historical reference.
- `ui`: keep, but prune unused components and stories-derived abstractions.
- `tx-builder`: keep, but isolate as one owned subsystem with strong tests.
- `form-builder` and `legos`: keep only the forms and fields still used by the active app.
- `data-fetch-utils`: inline or merge into the owning modules unless it still has clear cross-feature value.

Rule of thumb:

- If a “library” only exists because it used to be a package in the monorepo, that alone is no longer a reason to preserve it as a library.

### 5. Dependency and Runtime Cleanup

Run a post-migration dependency pass with deletion as the default.

Likely candidates to revisit in `haus-admin/package.json`:

- `@walletconnect/types`
- `@walletconnect/web3wallet`
- `localforage`
- `ethers-multisend`
- `@shazow/whatsabi`
- `react-datepicker`
- `react-markdown`

Expected output:

- A dependency review table with:
  - package
  - why it exists
  - active owner
  - remove / keep / isolate decision

Supportability rule:

- Every non-trivial dependency in the active app should have a named feature owner and a short reason it still exists.

### 6. Preserve Legacy Repositories, But Make Their Status Explicit

Preservation is good. Ambiguity is expensive.

Deliverables:

- Add a deprecation banner to [monorepo/README.md](/home/skuhl/Documents/ody/haus/monorepo/README.md).
- Add a deprecation banner to `haus-dao-hooks/` docs.
- Add a short `DEPRECATED.md` or equivalent note in `monorepo/`.
- Add a short `DEPRECATED.md` or equivalent note in `haus-dao-hooks/`.
- Remove “start here” ambiguity from any old docs that still read as if the monorepo is the primary development target.

Minimum standard:

- A new maintainer should not accidentally begin feature work in `monorepo/` or `haus-dao-hooks/`.

### 7. Add a Small Stability Harness Around the Hard Parts

Reducing support burden is not only about deleting code. It is also about protecting the code that remains.

Tests to add first:

- proposal status calculation
- tx polling / subgraph sync behavior
- safe balance normalization
- proposal action decoding helpers
- chain ID conversion and route parsing

Recommendation:

- Add focused unit tests around the pieces that are expensive to reason about and easy to regress.
- Avoid broad test ambitions for now; protect the risky seams first.

## Suggested Execution Order

### Phase A — Clarify Ownership

- Publish root-level active/deprecated status docs.
- Document that `haus-admin` is the only maintained codebase.
- Mark `monorepo` and `haus-dao-hooks` as deprecated reference-only archives.

### Phase B — Remove Highest-Cost Runtime Dependencies

- Decide whether WalletConnect proposal support stays, gets isolated, or is deprecated.
- tighten balance-fetching behavior around the current Sequence path
- Remove now-unused packages from `haus-admin`.

### Phase C — Simplify Internal Structure

- Label `src/lib/` modules by ownership status.
- Fold thin compatibility wrappers into feature code where possible.
- Move clearly transitional code into a visible `legacy/` area or delete it.

### Phase D — Freeze Legacy Systems

- Mark `monorepo` as deprecated for new feature work.
- Mark `haus-dao-hooks` as deprecated for new feature work.
- Align docs and contributor guidance.
- Stop back-and-forth copying unless there is a deliberate maintenance reason.

### Phase E — Hardening

- Add targeted tests around the remaining complex subsystems.
- Do one final dependency audit.
- Record success criteria and archive the migration plan as completed.

## Success Criteria

This post-migration effort is complete when:

- Maintainers have one obvious active app and one obvious place to add new work.
- Legacy repositories are still available, but clearly marked deprecated.
- `haus-admin` no longer depends on unnecessary legacy SDKs in active runtime paths, with any intentional exceptions documented.
- The remaining local libraries have explicit ownership and a justified reason to exist.
- The app’s highest-risk behaviors are covered by a small set of focused tests.

## First 5 Tickets I Would Create

1. Repository status docs: add root README guidance and deprecation markers for legacy codebases.
2. Balance-fetching hardening: keep Sequence as the active path, reduce duplicate requests, and document migration conditions for Safe API adoption.
3. WalletConnect decision memo: keep, isolate, or deprecate WalletConnect proposal flows.
4. `src/lib/` ownership audit: classify each local library as keep, flatten, freeze, or delete.
5. Support harness: add unit tests for proposal status, tx polling, safe balance normalization, and chain ID helpers.

## Addendum — Token Balance API Decision

### Decision

Keep Sequence-based token balance fetching as the active implementation for now.

### Why

- We already implemented both approaches and hit request-limit issues quickly with the Gnosis Safe API on the free plan.
- The Safe API may still be attractive functionally, but under the current budget it adds operational risk to a core admin workflow.
- Sequence is the more supportable default today because it avoids introducing a paid dependency decision before the rest of the repository has been simplified.

### What To Do Now

- Keep [useDaoTokenBalances.ts](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/hooks/useDaoTokenBalances.ts) as the default balance provider.
- Audit where balance hooks are called from list and detail views to reduce duplicate requests.
- Add caching and query-key discipline around token balances so we do not over-fetch.
- Document Sequence as an intentional runtime dependency in the dependency review.

### What Would Need To Be True To Revisit Gnosis Safe API

- We have a paid Safe API plan, higher request limits, or another reliable access path.
- We add request coalescing, stronger cacheing, and view-level fetch controls so the app does not burst traffic during normal navigation.
- We confirm chain coverage and response quality for all supported DAOhaus networks we care about in production.
- We can prove the new approach is cheaper or more reliable in real usage, not just cleaner architecturally.

### Suggested Future Migration Plan

1. Instrument current balance traffic so we know real request volume by page and user flow.
2. Add a provider abstraction for balance reads so Sequence and Safe API can be swapped without changing page code.
3. Test Safe API behind a feature flag on a subset of routes or environments.
4. Compare rate-limit behavior, latency, error rate, and operating cost.
5. Migrate only if the operational results are clearly better.

## Strong Recommendation

Do not treat post-migration as “Phase 7 polish.” Treat it as a repository simplification program with explicit deletion, deprecation, and ownership decisions.

That framing will do more to lower support cost than another round of feature parity work.
