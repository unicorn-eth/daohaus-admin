# Phase 6 — Polish & Modernization: Detailed Plan

## Audit Summary

### Already Done

| Item                                                                               | Status                           |
| ---------------------------------------------------------------------------------- | -------------------------------- |
| Dependency upgrades (wagmi v2, viem v2, react-query v5, react-router v7, react 19) | Done                             |
| Etherscan v2 block explorer (`getABIUrl`)                                          | Done                             |
| Proposal status helper (`proposalStatus.ts`) — comprehensive                       | Done                             |
| Toast notifications (`useToast`) — wired to sponsor/vote/process/cancel/summon     | Done                             |
| Basic loading states (`<Loading>` spinner)                                         | Done (minimal)                   |
| Basic empty states (proposals/members)                                             | Done (minimal — plain text only) |
| Farcaster utility (`farcastle.ts`)                                                 | Remove — not needed              |
| Goerli (0x5) — none found in chain keychains                                       | Clean                            |

---

## Remaining Work

---

### 1. React Query Config Tuning

**File:** `src/main.tsx`

`new QueryClient()` uses library defaults. Needs per-type stale/gc times.

**Target config:**

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 min default (DAO data, members)
      gcTime: 10 * 60 * 1000, // 10 min gc
    },
  },
});
```

**Steps:**

1. Set base defaults in `QueryClient` constructor in `src/main.tsx`
2. In `useDaoProposals` hook — add `staleTime: 30 * 1000` (30 sec, actively voting)
3. In `useDaoTokenBalances` hook — add `staleTime: 60 * 1000` (1 min)
4. Members and DAO data inherit the 2-min default — no changes needed

---

### 2. Environment Variable Validation

**New file:** `src/lib/env.ts`

Required vars: `VITE_WALLET_CONNECT_ID`, `VITE_GRAPH_API_KEY`, `VITE_ALCHEMY_KEY`,
`VITE_ETHERSCAN_KEY`, `VITE_GNOSIS_SAFE_API_KEY`. `VITE_SEQUENCE_KEY` is optional.

**Steps:**

1. Create `src/lib/env.ts` — reads all vars, throws with a clear message if required ones are missing
2. Import and call it at the top of `main.tsx` before rendering
3. Replace inline `import.meta.env.*` casts in `main.tsx` with the validated module

---

### 3. Remove Farcaster Code

**Files:**

- `src/lib/utils/utils/farcastle.ts` — delete
- `src/lib/utils/utils/index.ts` — remove the `farcastle` re-export

**Steps:**

1. Delete `src/lib/utils/utils/farcastle.ts`
2. Remove `export * from './farcastle'` from `src/lib/utils/utils/index.ts`
3. Confirm no other files import from `farcastle` or `getFarcastleFramemUrl`

---

### 4. Meaningful Empty States

**Files:**

- `src/components/ProposalList.tsx`
- `src/components/MemberList.tsx`
- `src/pages/Safes.tsx`
- `src/components/HomeDashboard.tsx`

Currently renders bare `<ParMd>No proposals found.</ParMd>`. Plan calls for "meaningful empty state UI."

**Steps:**

1. Create shared `src/components/EmptyState.tsx` — accepts `title`, optional `description`,
   optional `action` node. Centered layout with padding; supports an error variant.
2. Replace bare `<ParMd>` empties:
   - `ProposalList` — "No proposals yet" + link to create one (when wallet connected)
   - `MemberList` — "No members found"
   - `Safes.tsx` — audit current empty handling and apply
   - `HomeDashboard` — for DAO list when no DAOs are found
3. Error states (`Failed to load...`) also use `EmptyState` with error variant

---

### 5. Error Boundaries

**New file:** `src/components/ErrorBoundary.tsx`

No error boundaries exist. A single rendering error currently crashes the whole app.

**Steps:**

1. Create a class-based `ErrorBoundary` component using React's `componentDidCatch` pattern
2. Wrap each page-level route — either at `router.tsx` per route or at `DaoContainer` level
   for the DAO subtree and `HomeContainer` for the home subtree
3. Fallback UI: error message + "Try again" reset button + "Go home" link
4. `componentDidCatch` callback left open for future error reporting integration

---

### 6. TypeScript Strict Mode

**File:** `tsconfig.json`

`strict: true` is not set. Should have been enabled from the start.

**Steps:**

1. Add `"strict": true` to `compilerOptions` in `tsconfig.json`
2. Run `tsc --noEmit` and fix resulting errors
3. Common issues to expect: implicit `any` in event handlers, nullable returns not guarded,
   missing return types on some utils
4. Flag `any` casts in the lego system as `// TODO: tighten` rather than blocking on them

---

### 7. Remove Stale Goerli Endpoint Reference

**File:** `src/lib/keychain-utils/endpoints.ts` (line ~49)

One `tabula-goerli` subgraph URL remains. Goerli is shut down.

**Steps:**

1. If tabula is not used in the app, delete the entry outright
2. If tabula is used, replace with a Sepolia equivalent or remove the chain entry

---

### 8. Mobile Responsiveness Audit

**Scope:** All page files under `src/pages/`

`widthQuery` breakpoints are used in many places but no systematic audit has been done.

**Steps:**

1. Open each page at 375px viewport (iPhone SE)
2. Identify overflow, text truncation, button crowding issues
3. Fix using existing `widthQuery.sm` / `widthQuery.md` — no new infrastructure needed
4. Priority order: `DaoOverview`, `Proposals`, `Proposal`, `Members`, `Member`

---

## Suggested Execution Order

| #   | Item                   | Effort   | Value                                             |
| --- | ---------------------- | -------- | ------------------------------------------------- |
| 1   | TypeScript strict mode | Medium   | High — surfaces real bugs before adding more code |
| 2   | React Query tuning     | Small    | High — immediate UX and perf improvement          |
| 3   | Env validation         | Small    | High — prevents silent misconfiguration           |
| 4   | Remove Farcaster code  | Trivial  | Low — dead code removal                           |
| 5   | Error boundaries       | Small    | High — protects all subsequent work               |
| 6   | Empty states           | Medium   | Medium — visual polish, one shared component      |
| 7   | Mobile audit           | Variable | Medium — least predictable in scope               |
| 8   | Goerli cleanup         | Trivial  | Low — do anytime                                  |
