# Security And Dependency Audit

## Purpose

Use this monthly audit to identify vulnerable dependencies, stale packages, risky configuration drift, and repo-specific security issues in the Haus admin app.

This repo is a client-side Vite/React app for DAO administration. Treat wallet connection, transaction assembly, RPC/API integrations, environment handling, and dependency supply chain as the highest-risk areas.

## Monthly Audit Scope

### 1. Dependency Freshness

Run:

```sh
npm outdated --long
```

Prioritize:

- Direct runtime dependencies over dev-only tooling.
- Wallet, chain, crypto, signing, routing, markdown, GraphQL, and styling packages.
- Major-version updates that affect `wagmi`, `viem`, RainbowKit, WalletConnect, React Router, Vite, TypeScript, or React.
- Packages pinned through `overrides`, especially if the override exists to mitigate a security issue.

Report:

- Current, wanted, and latest versions.
- Whether the update is patch, minor, or major.
- Expected migration risk.
- Recommended next action.

### 2. Known Vulnerabilities

Run:

```sh
npm audit --audit-level=low
npm audit --audit-level=low --json
```

Prioritize:

- Critical and high findings first.
- Any vulnerability in wallet, signing, cryptography, transaction, RPC, HTTP, markdown, or rendering dependencies.
- Transitive vulnerabilities reachable from direct dependencies.
- Findings that require a semver-major fix or package replacement.

Report:

- Severity and advisory title.
- Direct dependency path that brings it in.
- Whether the vulnerable code is plausibly reachable in this browser app.
- Available fix and risk of the fix.
- Whether a temporary mitigation, package override, or replacement is appropriate.

### 3. Lockfile And Package Integrity

Run:

```sh
npm ci
npm run lint
npm run build
```

Check:

- `package.json` and `package-lock.json` agree.
- The lockfile was not manually edited in suspicious ways.
- The declared `node` and `npm` versions in `package.json` still match the team runtime.
- Any dependency changes preserve a clean install, lint, and production build.

### 4. Environment And Secret Exposure

Review:

- [`docs/ENVIRONMENT.md`](ENVIRONMENT.md)
- [`.env.example`](../.env.example)
- [`src/lib/env.ts`](../src/lib/env.ts)
- [`src/app/components/EnvWarning.tsx`](../src/app/components/EnvWarning.tsx)

Check:

- No real secrets, API keys, private RPC URLs, wallet keys, or tokens are committed.
- Required Vite variables are still documented.
- Browser-exposed `VITE_*` keys are treated as public client keys.
- Missing-env warnings remain clear and do not leak sensitive values.

### 5. Wallet, Chain, And Transaction Safety

Review:

- [`src/main.tsx`](../src/main.tsx)
- [`src/lib/wagmi-config.ts`](../src/lib/wagmi-config.ts)
- [`src/lib/tx-builder`](../src/lib/tx-builder/index.ts)
- [`src/lib/legos`](../src/lib/legos/index.ts)
- [`src/lib/keychain-utils`](../src/lib/keychain-utils/index.ts)
- Transaction-heavy feature folders such as `summon`, `proposal`, `settings`, `safe`, and `member`.

Check:

- Transaction args are derived from validated inputs.
- Chain IDs and contract addresses come from trusted keychain/config sources.
- User-controlled values are not blindly inserted into calldata, markdown, links, contract addresses, or API URLs.
- Errors and transaction previews do not hide important risk from users.
- Any new chain, contract, ABI, or transaction lego has a clear source and review trail.

### 6. Data Fetching And Rendering Safety

Review:

- DAO hook query construction in [`src/lib/dao-hooks`](../src/lib/dao-hooks/index.ts).
- Markdown rendering through `react-markdown`.
- External links, explorer links, token metadata, DAO metadata, proposal text, and member profile fields.

Check:

- Remote data is rendered safely.
- Links use safe protocols and avoid tabnabbing.
- GraphQL variables are used instead of string-concatenated query input when possible.
- Loading, empty, error, and stale states do not encourage unsafe user action.

### 7. Static Hygiene

Run targeted searches:

```sh
rg -n "dangerouslySetInnerHTML|eval\\(|new Function|innerHTML|outerHTML|document\\.write|localStorage|sessionStorage|window\\.open|target=\"_blank\"|TODO|FIXME|HACK" src
rg -n "api[_-]?key|secret|private[_-]?key|token|password|mnemonic|seed" .
```

Assess each match for actual risk. Do not report false positives as findings unless they need a concrete action.

### 8. Documentation Drift

Review:

- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md)
- [`docs/DEBUGGING.md`](DEBUGGING.md)
- [`docs/VERIFICATION.md`](VERIFICATION.md)
- Relevant `AGENT.md` files for changed areas.

Check:

- Audit instructions still match package scripts.
- Architecture docs still describe provider order, route structure, and transaction flow accurately.
- New high-risk areas have a documented verification path.

## Current Baseline Notes

As of May 12, 2026, a local audit showed:

- `npm audit --audit-level=low --json` reported 22 total vulnerabilities: 5 critical, 2 high, 6 moderate, and 9 low.
- Highest-priority direct findings include `@walletconnect/web3wallet`, `styled-components`, and `ethers-multisend`.
- Notable transitive findings include WalletConnect packages, `elliptic`, `axios`, `hono`, `postcss`, `follow-redirects`, and `@stablelib/ed25519`.
- `npm outdated --long` showed patch/minor updates for many runtime packages and major updates available for `wagmi`, `@radix-ui/colors`, ESLint, and Node type packages.

Treat these as a starting snapshot, not a permanent truth. Re-run the commands during each monthly audit.

## LLM Engineer Prompt

Copy this prompt into the LLM engineering workflow for the monthly scan:

```text
You are performing the monthly Security and Dependency Audit for the haus-admin repo.

Start by reading:
- docs/ARCHITECTURE.md
- docs/ENVIRONMENT.md
- docs/VERIFICATION.md
- docs/DEBUGGING.md
- docs/SECURITY_DEPENDENCY_AUDIT.md
- package.json

Context:
- This is a Vite + React 19 DAO admin app.
- Highest-risk areas are dependency supply chain, wallet connection, transaction assembly, chain/RPC config, API key handling, GraphQL/data fetching, markdown/link rendering, and external service integrations.
- Do not make package updates unless explicitly asked. First produce an audit report with prioritized findings and recommended actions.

Run these commands:
- git status --short
- npm outdated --long
- npm audit --audit-level=low
- npm audit --audit-level=low --json
- npm ci
- npm run lint
- npm run build
- rg -n "dangerouslySetInnerHTML|eval\\(|new Function|innerHTML|outerHTML|document\\.write|localStorage|sessionStorage|window\\.open|target=\"_blank\"|TODO|FIXME|HACK" src
- rg -n "api[_-]?key|secret|private[_-]?key|token|password|mnemonic|seed" .

Review these code areas for repo-specific security risk:
- src/lib/env.ts
- src/app/components/EnvWarning.tsx
- src/main.tsx
- src/lib/wagmi-config.ts
- src/lib/tx-builder
- src/lib/legos
- src/lib/keychain-utils
- src/lib/dao-hooks
- src/features/summon
- src/features/proposal
- src/features/settings
- src/features/safe
- src/features/member

Produce a concise audit report with:
1. Executive summary.
2. Critical/high dependency risks, including package, severity, dependency path, reachability, fix availability, and recommended action.
3. Moderate/low dependency risks worth tracking.
4. Outdated direct dependencies grouped by safe patch/minor updates versus risky major migrations.
5. Wallet, chain, and transaction safety observations.
6. Environment and secret exposure observations.
7. Data rendering, markdown, link, and GraphQL safety observations.
8. Verification results for npm ci, lint, and build.
9. A prioritized action plan for the next month.

Rules:
- Lead with real risks and concrete actions.
- Do not claim a vulnerability is exploitable unless the code path makes that plausible.
- Separate direct dependency problems from transitive dependency problems.
- Flag semver-major fixes clearly.
- Mention any commands that failed or could not be run.
- Do not print secret values if any are discovered. Report only file path, variable/key name, and severity.
```
