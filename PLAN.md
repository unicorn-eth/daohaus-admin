# haus-admin — Modernization Plan

**Goal:** Rebuild the DAOhaus admin app as a standalone Vite + React application, replacing outdated dependencies, integrating `haus-dao-hooks` for data, RainbowKit for wallet connection, and progressively porting UI components and transaction infrastructure from the monorepo.

**Source reference:** `monorepo/apps/admin/` + `monorepo/libs/` + `haus-dao-hooks/`  
**Target:** `haus-admin/` (this directory)  
**Date:** April 2026

---

## Table of Contents

1. [Overview & Key Decisions](#overview--key-decisions)
2. [Dependency Map](#dependency-map)
3. [Phase 0 — Project Bootstrap](#phase-0--project-bootstrap)
4. [Phase 1 — Core Infrastructure](#phase-1--core-infrastructure)
5. [Phase 2 — Data Layer](#phase-2--data-layer)
6. [Phase 3 — Shared Libraries](#phase-3--shared-libraries)
7. [Phase 4 — Pages: Read (Data Display)](#phase-4--pages-read-data-display)
8. [Phase 5 — Pages: Write (Transactions & Forms)](#phase-5--pages-write-transactions--forms)
9. [Phase 6 — Polish & Modernization](#phase-6--polish--modernization)
10. [Open Questions](#open-questions)
11. [Modernization Issues Identified](#modernization-issues-identified)

---

## Overview & Key Decisions

| Concern         | Old (monorepo)                                                 | New (haus-admin)                       |
| --------------- | -------------------------------------------------------------- | -------------------------------------- |
| Build tool      | NX 15 + Webpack + Babel                                        | Vite 6                                 |
| React           | 18.2.0                                                         | 18.3+ (or 19)                          |
| Routing         | react-router-dom 6.4                                           | react-router-dom 7                     |
| Wallet          | `@daohaus/connect` (wagmi v1)                                  | RainbowKit v2 + wagmi v2               |
| RPC provider    | Rivet + Alchemy                                                | Alchemy only                           |
| Data fetching   | `@daohaus/moloch-v3-data` + `moloch-v3-hooks` (react-query v3) | `haus-dao-hooks` (TanStack Query v5)   |
| UI components   | `@daohaus/ui` (styled-components v6, react-icons)              | Ported to `src/lib/ui/` (lucide-react) |
| Forms           | `@daohaus/form-builder` + `@daohaus/form-builder-base`         | Ported to `src/lib/form-builder/`      |
| Transactions    | `@daohaus/tx-builder`                                          | Ported to `src/lib/tx-builder/`        |
| Lego configs    | `@daohaus/moloch-v3-legos`                                     | Ported to `src/lib/legos/`             |
| Block explorer  | Multi-key Etherscan v1                                         | Etherscan v2 (single API key)          |
| Icons           | `react-icons`                                                  | `lucide-react`                         |
| Package manager | Yarn 1 (workspace)                                             | npm / pnpm                             |
| TypeScript      | 5.0.4                                                          | 5.6+                                   |

### Architectural Approach

All `@daohaus/*` library code will be **copied into `src/lib/`** as local source — not installed from npm. This eliminates build tool complexity, makes dependencies visible and editable, and avoids publishing cycles. Each lib folder will be updated in place as we build each phase.

```
src/
├── lib/
│   ├── ui/              # Ported from @daohaus/ui (minus Storybook)
│   ├── dao-hooks/       # From haus-dao-hooks/
│   ├── utils/           # From @daohaus/utils
│   ├── keychain-utils/  # From @daohaus/keychain-utils (Alchemy RPCs)
│   ├── abis/            # From @daohaus/abis
│   ├── form-builder/    # From @daohaus/form-builder + form-builder-base (Phase 5)
│   ├── tx-builder/      # From @daohaus/tx-builder (Phase 5)
│   └── legos/           # From @daohaus/moloch-v3-legos + moloch-v3-fields (Phase 5)
├── components/          # App-level components (DaoCard, ProposalCard, etc.)
├── pages/               # Route page components
├── layout/              # DaoContainer, HomeContainer, nav
├── hooks/               # App-level hooks
└── utils/               # App-level utilities
```

---

## Dependency Map

### What Goes In Phase by Phase

**Phase 0–1 (scaffold + providers):**

- `vite`, `@vitejs/plugin-react`, `typescript`
- `react`, `react-dom`, `react-router-dom@7`
- `wagmi@2`, `viem@2`, `@rainbow-me/rainbowkit@2`
- `@tanstack/react-query@5`, `@tanstack/react-query-devtools@5`
- `styled-components@6`

**Phase 2 (data layer):**

- `graphql-request@7`
- `0xsequence@2` (token indexer for vault balances — may be replaced by Gnosis Safe API in Phase 4g, install now as fallback)
- Copy `haus-dao-hooks/src/` → `src/lib/dao-hooks/`

**Phase 3 (UI library):**

- `lucide-react` (replaces react-icons)
- `@radix-ui/*` (keep as-is — already compatible)
- `react-hook-form@7`
- Copy `libs/ui/src/` → `src/lib/ui/` (strip Storybook, swap icons)

**Phase 5 (tx + forms):**

- `ethers@6` (upgrade from v5 during port)
- Copy `libs/tx-builder/src/` → `src/lib/tx-builder/`
- Copy `libs/form-builder/src/` + `form-builder-base/src/` → `src/lib/form-builder/`
- Copy `libs/moloch-v3-legos/src/` → `src/lib/legos/`
- Copy `libs/moloch-v3-fields/src/` → `src/lib/legos/fields/`

---

## Phase 0 — Project Bootstrap

**Goal:** Working Vite + React + TypeScript app that builds and runs.

### Steps

1. **Scaffold the app**

   ```bash
   npm create vite@latest haus-admin -- --template react-ts
   cd haus-admin
   npm install
   ```

2. **Install core runtime dependencies**

   ```bash
   npm install react-router-dom@7 wagmi@2 viem@2 \
     @rainbow-me/rainbowkit@2 \
     @tanstack/react-query@5 @tanstack/react-query-devtools@5 \
     styled-components@6 lucide-react \
     graphql-request@7 0xsequence@2 \
     react-hook-form@7
   ```

3. **Configure TypeScript** — tighten `tsconfig.app.json`:
   - `"strict": true`
   - `"moduleResolution": "bundler"`
   - Add path aliases:
     ```json
     "paths": {
       "@/lib/*": ["./src/lib/*"],
       "@/components/*": ["./src/components/*"],
       "@/pages/*": ["./src/pages/*"],
       "@/hooks/*": ["./src/hooks/*"],
       "@/utils/*": ["./src/utils/*"],
       "@/layout/*": ["./src/layout/*"]
     }
     ```

4. **Configure Vite** — `vite.config.ts`:
   - Add `@vitejs/plugin-react`
   - Resolve path aliases (mirror tsconfig)
   - Configure `define` for env variables

5. **Environment variables** — `.env.local` (create `.env.example` to commit):

   ```
   VITE_WALLET_CONNECT_ID=
   VITE_ALCHEMY_KEY=
   VITE_GRAPH_API_KEY=
   VITE_ETHERSCAN_KEY=
   ```

   > Note: Single `VITE_ETHERSCAN_KEY` replaces the 6 separate chain-specific keys. Etherscan v2 uses one key across all supported chains.

6. **Git setup** — `.gitignore` for `node_modules`, `.env.local`, `dist`

**Testable:** `npm run dev` serves the default Vite React starter.

---

## Phase 1 — Core Infrastructure

**Goal:** Providers, routing skeleton, and layout shell that match the current admin's structure.

### Steps

1. **Wagmi config** — `src/lib/wagmi-config.ts`
   - Supported chains: `mainnet`, `gnosis`, `optimism`, `arbitrum`, `base`, `sepolia` (from wagmi/chains)
   - Transports: `alchemy(VITE_ALCHEMY_KEY)` for each chain — **no Rivet**
   - RainbowKit `getDefaultConfig` with standard wallet list (no Sequence wallet needed)

   ```ts
   import { http } from "wagmi";
   import {
     mainnet,
     gnosis,
     optimism,
     arbitrum,
     base,
     sepolia,
   } from "wagmi/chains";
   import { getDefaultConfig } from "@rainbow-me/rainbowkit";

   const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;

   export const wagmiConfig = getDefaultConfig({
     appName: "DAOhaus Admin",
     projectId: import.meta.env.VITE_WALLET_CONNECT_ID,
     chains: [mainnet, gnosis, optimism, arbitrum, base, sepolia],
     transports: {
       [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`),
       [gnosis.id]: http(
         `https://gnosis-mainnet.g.alchemy.com/v2/${alchemyKey}`,
       ),
       [optimism.id]: http(
         `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`,
       ),
       [arbitrum.id]: http(
         `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`,
       ),
       [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`),
       [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`),
     },
   });
   ```

   > Gnosis chain support on Alchemy is confirmed. No fallback RPC needed.

2. **Root providers** — `src/main.tsx`

   ```tsx
   <WagmiProvider config={wagmiConfig}>
     <QueryClientProvider client={queryClient}>
       <RainbowKitProvider>
         <DaoHooksProvider
           keyConfig={{ graphKey: import.meta.env.VITE_GRAPH_API_KEY }}
         >
           <RouterProvider router={router} />
         </DaoHooksProvider>
       </RainbowKitProvider>
     </QueryClientProvider>
   </WagmiProvider>
   ```

3. **Routing** — `src/router.tsx` with `createBrowserRouter`:

   ```
   /                                           → HomeContainer → Home
   /molochv3/:daochain/:daoid                  → DaoContainer → DaoOverview
   /molochv3/:daochain/:daoid/proposals        → Proposals
   /molochv3/:daochain/:daoid/proposal/:proposalId → Proposal
   /molochv3/:daochain/:daoid/members          → Members
   /molochv3/:daochain/:daoid/member/:memberAddress → Member
   /molochv3/:daochain/:daoid/safes            → Safes
   /molochv3/:daochain/:daoid/settings         → Settings
   /molochv3/:daochain/:daoid/settings/update  → UpdateSettings
   /molochv3/:daochain/:daoid/new-proposal     → NewProposal
   /molochv3/:daochain/:daoid/ragequit         → RageQuit
   ```

   > URL scheme is preserved from the old monorepo (`/molochv3/:daochain/:daoid`) to maintain compatibility with existing bookmarks and external links.

4. **Layout shell** — placeholder `HomeContainer` and `DaoContainer` components with connect button (RainbowKit `<ConnectButton />`) and nav links matching the current admin. Full nav/theme implementation happens in Phase 3 once UI lib is in place.

5. **CurrentDao context** — `src/hooks/useCurrentDao.ts`
   - Simple React context storing `{ daoChain, daoId }` derived from route params
   - Replaces `@daohaus/moloch-v3-hooks` `CurrentDaoProvider` / `useCurrentDao()`

**Testable:** App loads, routes render placeholder text for each page, RainbowKit connect modal works, wallet connects.

---

## Phase 2 — Data Layer

**Goal:** `haus-dao-hooks` wired in and returning real data.

### Steps

1. **Copy dao-hooks source** — `haus-dao-hooks/src/` → `src/lib/dao-hooks/`
   - Update any internal relative imports
   - Ensure `DaoHooksProvider` and `DaoHooksContext` export properly from `index.ts`

2. **Verify types** — `src/lib/dao-hooks/utils/types.ts` is the canonical type file. Create `src/types/index.ts` that re-exports from there plus any app-specific types.

   Key types to use across the app:
   - `DaoItem`, `DaoProfile`, `DaoProfileLink`
   - `MemberItem`
   - `ProposalItem`, `VoteItem`
   - `VaultItem`, `ShamanItem`
   - `TokenBalance`
   - `RecordItem`, `RecordItemParsed`
   - `ExitItem`
   - `SubgraphQueryOrderPaginationOptions`

3. **Hook mapping** — Old → New:

   | Old hook (monorepo)                                | New hook (dao-hooks)                                  |
   | -------------------------------------------------- | ----------------------------------------------------- |
   | `useDaoData({ daoId, daoChain })`                  | `useDao({ chainid, daoid })`                          |
   | `useDaosByUser({ userAddress })`                   | `useDaosForAddress({ chainid, address })`             |
   | `useDaoProposals({ daoId, daoChain })`             | `useDaoProposals({ chainid, daoid })`                 |
   | `useDaoProposal({ proposalId, daoId, daoChain })`  | `useProposal({ chainid, daoid, proposalid })`         |
   | `useDaoMembers({ daoId, daoChain })`               | `useDaoMembers({ chainid, daoid })`                   |
   | `useDaoMember({ memberAddress, daoId, daoChain })` | `useMember({ chainid, daoid, memberaddress })`        |
   | `useConnectedMember()`                             | `useMember({ ..., memberaddress: connectedAddress })` |
   | `useDaoRecords({ daoId, daoChain, table })`        | `useDaoListRecords({ chainid, daoid, table })`        |
   | Token balances (via subgraph vaults)               | `useDaoTokenBalances({ chainid, safeAddress })`       |

   > **Gap:** Old monorepo has `useDaosByUser` returning all DAOs where user is a member with full DAO data. New `useDaosForAddress` returns DAOs + member records but may need additional `useDao` calls per DAO if profile data isn't fully joined. Verify subgraph query depth in `haus-dao-hooks/src/utils/queries.ts` and add joins if needed.

4. **Chain ID handling** — The app receives `daochain` from URL params as a hex string (e.g., `0x64`). Wagmi uses numeric chain IDs. Create utility `src/utils/chainIds.ts` that converts between formats and validates against supported chains.

5. **Mainnet subgraph support** — The `haus-dao-hooks` `endpoints.ts` currently does not include a DAOHAUS subgraph ID for Ethereum mainnet (`0x1`). Add the mainnet subgraph ID:
   - Find the deployed mainnet subgraph ID from The Graph (check `monorepo/apps/moloch-v3-subgraph/` or the DAOhaus Graph dashboard)
   - Add to `SUBGRAPH_IDS.DAOHAUS` in `src/lib/dao-hooks/utils/endpoints.ts`:
     ```ts
     "0x1": `<mainnet-subgraph-id>`,
     ```
   - Also add `"0x1"` to the Sequence token indexer map (already exists: `"0x1": "https://mainnet-indexer.sequence.app"`)
   - Ensure wagmi config includes `mainnet` in the chains list (already the case from Phase 1)
   - Test by querying a known mainnet DAO

6. **Profile records** — DAO profiles are stored as Poster records on the subgraph. The `useDao` hook in dao-hooks includes `rawProfile: RecordItem[]` and a parsed `profile?: DaoProfile`. Verify this is populated correctly and matches what the current admin shows in `DaoOverview`.

**Testable:** Add temporary debug component to Home page that calls `useDaosForAddress` with connected wallet address and logs results. Data flows from subgraph through hooks to component. Confirm mainnet DAOs appear alongside L2 DAOs.

---

## Phase 3 — Shared Libraries

**Goal:** UI component library and shared utilities in place, styled-components theme working, app looks like DAOhaus.

### Steps

1. **Copy utility libraries:**
   - `monorepo/libs/utils/src/` → `src/lib/utils/`
   - `monorepo/libs/keychain-utils/src/` → `src/lib/keychain-utils/`
   - `monorepo/libs/abis/src/` → `src/lib/abis/`

2. **Update `keychain-utils`** for Alchemy RPCs:
   - In `endpoints.ts` / `networkData.ts`: replace all Rivet RPC URLs with Alchemy endpoints
   - Replace the `NX_RIVET_KEY` references with `VITE_ALCHEMY_KEY`
   - Update `explorerUtils.ts` for Etherscan v2 — a single `apiKey` parameter works for all chains with the v2 endpoint: `https://api.etherscan.io/v2/api?chainid={chainId}&...`

3. **Copy UI library:**
   - `monorepo/libs/ui/src/` → `src/lib/ui/`
   - Remove all Storybook files (`*.stories.tsx`, `*.stories.ts`, `*.mdx`)
   - Remove Storybook config directories if any
   - Remove `@storybook/*` from any nested package references

4. **Swap react-icons → lucide-react** in `src/lib/ui/`:
   - Run `grep -r "react-icons" src/lib/ui/` to find all usages
   - Replace with `lucide-react` equivalents (see table below)
   - The APIs are compatible: both use `<IconName size={n} color={c} />`

   | react-icons           | lucide-react    |
   | --------------------- | --------------- |
   | `RiArrowDropDownLine` | `ChevronDown`   |
   | `RiCloseLine`         | `X`             |
   | `RiCheckLine`         | `Check`         |
   | `RiExternalLinkLine`  | `ExternalLink`  |
   | `RiFileCopyLine`      | `Copy`          |
   | `RiMenuLine`          | `Menu`          |
   | `RiLoader4Line`       | `Loader2`       |
   | `RiAlertLine`         | `AlertTriangle` |
   | `RiInformationLine`   | `Info`          |
   | `RiErrorWarningLine`  | `AlertCircle`   |
   | `RiGridFill`          | `LayoutGrid`    |
   | `RiListUnordered`     | `List`          |
   | `RiArrowUpLine`       | `ArrowUp`       |
   | `RiArrowDownLine`     | `ArrowDown`     |
   | `RiShareLine`         | `Share2`        |
   | `RiUserLine`          | `User`          |
   | `RiSettings3Line`     | `Settings`      |
   | `RiAddLine`           | `Plus`          |

5. **Theme setup** — `src/lib/ui/theme/` already has `HausThemeProvider`. Wire it into `src/main.tsx` wrapping the app inside providers.

6. **Fix any typed imports** — The UI lib uses `@daohaus/utils` imports. Repoint these to `@/lib/utils`.

7. **Build the real layout** — now that the UI lib is in place:
   - Implement `HomeContainer` with `DHLayout` equivalent using ported nav components
   - Implement `DaoContainer` with DAO header, nav sidebar, and breadcrumbs
   - Connect button switches from raw `<ConnectButton />` to styled version using UI components + RainbowKit modal

8. **Component audit** — list which UI lib components are actually used by the admin app. Initially we need:
   - All layout components (`SingleColumnLayout`, `BiColumnLayout`, etc.)
   - All typography atoms (`H1`–`H4`, `ParMd`, `ParSm`, etc.)
   - `Button`, `Card`, `Badge`, `Avatar`
   - `Dialog`, `Dropdown`, `Tabs`, `Toast`
   - `AddressDisplay`, `DataIndicator`, `ProfileAvatar`
   - `Input`, `Select`, `Checkbox`, `Switch` (needed for Phase 5)
   - All wrapped form inputs (needed for Phase 5)

**Testable:** App renders with DAOhaus visual design. Theme is applied. Layout looks correct on home and DAO pages. No react-icons imports remain.

---

## Phase 4 — Pages: Read (Data Display)

**Goal:** All pages render correctly with real data. No transaction or form functionality yet — those are stubs.

Build pages in this order (simplest to most complex):

### 4a. Home Dashboard

Replicate `HomeDashboard` — lists all DAOs the connected user is a member of.

Functionality to exclude:
We are not going to include the Filter by network (chain selector). That can be controlled with the ConnectButton in the AppLayout.tsx. The list of daos should always display the connected network. Instead of the filter, just display the connected network name in the menu area above the dao list.

- **Data:** `useDaosForAddress({ chainid, address: connectedAddress })`
- **Features:**
  - Card view and table view toggle
  - Display connected network name
  - Search by DAO name
  - Sort by name, member count, proposal count
  - Handles disconnected state (show connect prompt)
- **Components to build:** `DaoCard`, `DaoTable`, `SearchInput`, `SortDropdown`, `ListActions`
- **Types:** `DaoItem`, `MemberItem`
- **Source files:**
  - `monorepo/apps/admin/src/pages/Home.tsx` — page entry point
  - `monorepo/apps/admin/src/components/HomeDashboard.tsx` — top-level dashboard component
  - `monorepo/apps/admin/src/components/DaoCard.tsx` → `DaoCard`
  - `monorepo/apps/admin/src/components/DaoTable.tsx` → `DaoTable`
  - `monorepo/apps/admin/src/components/SearchInput.tsx` → `SearchInput`
  - `monorepo/apps/admin/src/components/SortDropdown.tsx` → `SortDropdown`
  - `monorepo/apps/admin/src/components/ListActions.tsx` → `ListActions`
  - `monorepo/apps/admin/src/components/HomeNotConnected.tsx` → disconnected state prompt

> **Note:** Old admin fetches all DAOs and filters client-side. `useDaosForAddress` in dao-hooks already filters by member address..

### 4b. DAO Overview

Replicate `DaoOverview` — main dashboard for a single DAO.

- **Data:** `useDao({ chainid, daoid })`
- **Features:**
  - DAO name, avatar, description
  - Key stats: total shares, total loot, member count, proposal count

- **Components to build:** `DaoOverviewCard`, `DaoStats`
- **Types:** `DaoItem`, `VaultItem`
- **Source files:**
  - `monorepo/apps/admin/src/pages/DaoOverview.tsx` — page entry point (thin wrapper, delegates entirely to macro-ui)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoOverview/DaoOverview.tsx` → `DaoOverviewCard` (contains stats)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoOverview/DaoProfile.tsx` — name, avatar, description sub-component

### 4c. Proposals List

Replicate `Proposals` — all proposals for a DAO.

- **Data:** `useDaoProposals({ chainid, daoid })`
- **Features:**
  - List of proposals with status badge, title, vote counts, timing
  - Pagination/infinite scroll
  - Filter by status (active, passed, failed, cancelled)
  - "New Proposal" button → stub (Phase 5)
- **Components to build:** `ProposalCard`, `ProposalStatusBadge`, `ProposalList`
- **Types:** `ProposalItem`
- **Proposal status calculation:** Port `proposalsStatus.ts` from `monorepo/libs/moloch-v3-data/src/` — contains `getProposalStatus()` logic that determines state from timestamps and boolean flags
- **Source files:**
  - `monorepo/apps/admin/src/pages/Proposals.tsx` — page entry point (thin wrapper, delegates to macro-ui)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalList/ProposalList.tsx` → `ProposalList` (includes filter, search, pagination)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalList/FilterDropdown.tsx` — status filter UI
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalList/SearchInput.tsx` — search input
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/ProposalCard.tsx` → `ProposalCard`
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/ProposalCardOverview.tsx` — card header/overview section
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/VotingBar.tsx` → `VoteBar` (yes/no percentages)

### 4d. Proposal Detail

Replicate `Proposal` — single proposal detail view.

- **Data:** `useProposal({ chainid, daoid, proposalid })`
- **Features:**
  - Proposal title, description, type badge
  - Vote counts (yes/no with percentages, quorum indicator)
  - Voting timeline (sponsored at, voting ends, grace ends)
  - Vote list (who voted yes/no)
  - Proposal actions section (vote, sponsor, process, cancel) → stubs (Phase 5)
  - Transaction history
  - Decoded action data panel → stub (Phase 5 Op 15)
- **Components to build:** `ProposalDetails`, `VoteList`, `VoteBar`, `ProposalTimeline`
- **Types:** `ProposalItem`, `VoteItem`
- **Source files:**
  - `monorepo/apps/admin/src/pages/Proposal.tsx` — page entry point
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalDetails/ProposalDetails.tsx` → `ProposalDetails`
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalDetails/ProposalDetailsContainer.tsx` — layout wrapper with data fetching
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalDetails/ProposalAdditionalDetails.tsx` — timeline and extended metadata
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalHistory/VoteList.tsx` → `VoteList`
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalHistory/ProposalHistory.tsx` — transaction history section
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalHistory/ProposalHistoryCard.tsx` — individual history entry
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/VotingBar.tsx` → `VoteBar`
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalActionData/ProposalActionData.tsx` — decoded proposal action data display → **stub in Phase 4** (render placeholder "Action data loading..." section); fully implemented in Phase 5 Op 15 once tx-builder is ported

### 4e. Members List

Replicate `Members` — all members of a DAO.

- **Data:** `useDaoMembers({ chainid, daoid })`
- **Features:**
  - Member list with address, shares, loot, delegate info
  - Member action menu (Delegate To, Guild Kick) → stub (Phase 5)
  - "Add Member" button → stub (Phase 5)
- **Components to build:** `MemberList`, `MemberRow`
- **Types:** `MemberItem`
- **Source files:**
  - `monorepo/apps/admin/src/pages/Members.tsx` — page entry point
  - `monorepo/libs/moloch-v3-macro-ui/src/components/MemberList/MemberList.tsx` → `MemberList`
  - `monorepo/libs/moloch-v3-macro-ui/src/components/MemberList/MembersOverview.tsx` — aggregate stats header (total shares, loot, member count)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/MemberDisplay/MemberDisplay.tsx` → `MemberRow` (address + ENS display per row)

### 4f. Member Detail

Replicate `Member` — single member profile.

- **Data:** `useMember({ chainid, daoid, memberaddress })`
- **Features:**
  - Member address, shares, loot
  - Delegate info (delegating to, delegate count)
  - Vote history for this member
  - ENS name and avatar resolution for member address
- **ENS resolution:** Use wagmi's `useEnsName` and `useEnsAvatar` hooks for displaying human-readable names on member addresses. Apply this pattern consistently across all address displays in the app (member list, proposal cards, vote lists, etc.):
  ```ts
  import { useEnsName, useEnsAvatar } from "wagmi";
  const { data: ensName } = useEnsName({ address: memberAddress, chainId: 1 }); // ENS always resolves on mainnet
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: 1,
  });
  ```
  Wrap this in a reusable `useProfile(address)` hook at `src/hooks/useProfile.ts` that returns `{ ensName, ensAvatar, displayName }` — `displayName` falls back to a truncated address if no ENS name found. This replaces `@daohaus/profile-data`.
- **Components to build:** `MemberProfile`, `MemberStats`
- **Types:** `MemberItem`
- **Source files:**
  - `monorepo/apps/admin/src/pages/Member.tsx` — page entry point
  - `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/MemberProfileCard.tsx` → top-level card (shares, loot, delegate)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/MemberProfile.tsx` → `MemberProfile` (avatar, address, ENS)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/MemberProfileAvatar.tsx` — avatar + ENS display
  - `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/MemberTokens.tsx` — shares/loot breakdown
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalDetails/MemberDataPoint.tsx` — reusable labeled stat

### 4g. Safes / Vaults

Replicate `Safes` — list of DAO-controlled safes and token balances.

- **Data:** `useDao()` for vault list, `useDaoTokenBalances({ chainid, safeAddress })` per vault
- **Features:**
  - List of safes (name, address, ragequittable flag)
  - Token balances per safe
  - "New Safe" button → stub (Phase 5)
- **Components to build:** `SafeCard`, `TokenBalanceList`
- **Types:** `VaultItem`, `TokenBalance`
- **Source files:**
  - `monorepo/apps/admin/src/pages/Safes.tsx` — page entry point
  - `monorepo/libs/moloch-v3-macro-ui/src/components/SafesList/SafesList.tsx` — list container (iterates vaults, renders one SafeCard each)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/SafeCard/SafeCard.tsx` → `SafeCard` (name, address, ragequittable flag)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/SafeCard/SafeBalancesTable.tsx` → `TokenBalanceList` (ERC-20 rows with amounts)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/SafeCard/SafeActionMenu.tsx` — action menu (add safe, etc.) → stub in Phase 4

#### Token Balance API Assessment: Sequence Indexer vs. Gnosis Safe API

The current implementation uses the **Sequence Indexer** (`0xsequence`) to fetch ERC-20 token balances per safe address. Before building the Safes page, evaluate switching to the **Gnosis Safe Transaction Service API** as an alternative:

|                      | Sequence Indexer                                            | Gnosis Safe API                                                                 |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Endpoint**         | `https://{chain}-indexer.sequence.app`                      | `https://safe-transaction-{chain}.safe.global/api/v1/safes/{address}/balances/` |
| **Coverage**         | Multi-chain, all EVM addresses                              | Only addresses that are Gnosis Safes                                            |
| **Data**             | ERC-20 balances + metadata                                  | Native + ERC-20 balances + fiat values (via CoinGecko)                          |
| **Native token**     | Separate query needed                                       | Included in balances response                                                   |
| **Fiat values**      | No                                                          | Yes (USD via CoinGecko)                                                         |
| **API key required** | No                                                          | No (public API)                                                                 |
| **Chain support**    | Mainnet, Gnosis, Polygon, Optimism, Arbitrum, Base, Sepolia | Same + more                                                                     |
| **Extra dependency** | `0xsequence@2`                                              | None — plain `fetch`                                                            |
| **Limitation**       | Works on any address                                        | Only works if the address is a registered Gnosis Safe                           |

**Recommendation:** All DAOhaus safes _are_ Gnosis Safes by definition, so the limitation is not a concern. The Gnosis Safe API returns native token balances alongside ERC-20s, includes USD fiat values, and requires no extra SDK dependency. **Prefer the Gnosis Safe API** unless chain coverage is a blocker.

**Implementation:** Replace `useDaoTokenBalances` in `src/lib/dao-hooks/` with a new `useSafeBalances` hook that calls the Safe Transaction Service:

```ts
// src/hooks/useSafeBalances.ts
const SAFE_API_BASE: Record<string, string> = {
  "0x1": "https://safe-transaction-mainnet.safe.global",
  "0x64": "https://safe-transaction-gnosis-chain.safe.global",
  "0xa": "https://safe-transaction-optimism.safe.global",
  "0xa4b1": "https://safe-transaction-arbitrum.safe.global",
  "0x2105": "https://safe-transaction-base.safe.global",
  "0xaa36a7": "https://safe-transaction-sepolia.safe.global",
};
// GET {base}/api/v1/safes/{safeAddress}/balances/?trusted=true
```

### 4h. Settings

Replicate `Settings` — DAO governance configuration.

- **Data:** `useDao({ chainid, daoid })`
- **Features:**
  - All governance params (voting period, grace period, quorum, sponsor threshold, proposal offering, min retention)
  - Metadata (name, description, avatar, tags, links)
  - Shamans list with permissions
  - "Edit Settings" button → stub (Phase 5)
- **Components to build:** `SettingsCard`, `ShamanList`
- **Types:** `DaoItem`, `ShamanItem`, `DaoProfile`
- **Source files:**
  - `monorepo/apps/admin/src/pages/Settings.tsx` — page entry point
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoSettings/DaoSettings.tsx` → top-level settings component (`SettingsCard`)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoSettings/GovernanceSettings.tsx` — voting period, grace period, quorum, thresholds
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoSettings/MetadataSettings.tsx` — name, description, avatar, tags, links
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoSettings/ShamanList.tsx` → `ShamanList`
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoSettings/TokenSettings.tsx` — shares/loot token info
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoSettings/ContractSettings.tsx` — contract addresses display

**Testable after each page:** Page renders real data, handles loading and error states, all read-only UI matches the current admin app visually.

---

## Phase 5 — Pages: Write (Transactions & Forms)

**Goal:** All write operations — voting, proposals, settings updates, member management, rage quit.

This phase requires porting the transaction and form infrastructure from the monorepo. Work in this order:

### 5a. Port Transaction Infrastructure

1. **Copy `tx-builder`** — `monorepo/libs/tx-builder/src/` → `src/lib/tx-builder/`
   - Update all `@daohaus/*` imports to local paths
   - Upgrade ethers from v5 to v6 (or rewrite to viem — see notes)
   - Replace `@daohaus/connect` usage with wagmi v2 hooks

   > **Ethers v5 → v6 note:** The tx-builder uses ethers v5 extensively. Upgrading to v6 involves namespace changes (e.g., `ethers.utils.X` → `ethers.X`, `ethers.BigNumber` → native `bigint`). Alternatively, rewrite to use viem directly since we already have it. Given the complexity of tx-builder's encoding/decoding logic, the safest path is upgrading to ethers v6 rather than rewriting to viem. Evaluate on a function-by-function basis.

2. **IPFS integration** — tx-builder uses Pinata for IPFS uploads. Verify Pinata API still active and update API calls if needed. Consider migrating to a current Pinata SDK version.

3. **Wire `TXBuilder` provider** — Add to `DaoContainer` wrapping DAO routes, replacing the monorepo's `TXBuilder` context provider. Supply `chainId`, `daoId`, `safeId`, and `publicClient` from wagmi.

### 5b. Port Form Infrastructure

1. **Copy `form-builder-base`** — `monorepo/libs/form-builder-base/src/` → `src/lib/form-builder/base/`
   - Update all imports
   - Verify react-hook-form v7 compatibility (should be fine)

2. **Copy `form-builder`** — `monorepo/libs/form-builder/src/` → `src/lib/form-builder/`
   - Update all imports
   - Wire to local tx-builder

3. **Copy `moloch-v3-legos`** — `monorepo/libs/moloch-v3-legos/src/` → `src/lib/legos/`
   - Update all imports
   - Update contract addresses if any have changed

4. **Copy `moloch-v3-fields`** — `monorepo/libs/moloch-v3-fields/src/` → `src/lib/legos/fields/`
   - Update all imports
   - Update any WalletConnect references (currently uses WC v2 — verify still correct)

5. **Field config** — replicate `apps/admin/src/legos/legoConfig.tsx` as `src/legos/legoConfig.ts` mapping field type strings to local field components.

### 5c. Implement Write Operations

Build each write operation one at a time and test on Sepolia before moving to the next. Each operation is listed with its source files in the monorepo, what needs to be ported or built new in `haus-admin`, and whether it uses a form lego or fires a transaction directly.

---

#### Op 1 — Vote on Proposal

**Where:** `Proposal` page, right-side actions card  
**Trigger:** Direct transaction — no form lego  
**What it does:** Yes/No vote buttons that call `Baal.submitVote(proposalId, approved)`

**Source files to port:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/ProposalActions.tsx` — top-level status router (`ProposalActions`); dispatches to sub-components based on `proposal.status`
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/VotingPeriod.tsx` — checks if user has already voted; routes to `HasVoted` or `HasNotVoted`
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/HasNotVoted.tsx` — renders Yes/No vote buttons; calls `fireTransaction` with `ACTION_TX.VOTE` + `staticArgs: [proposalId, voteValue]`
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/HasVoted.tsx` — read-only display of user's existing vote
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/legos.ts` — defines `ACTION_TX.VOTE` (`Baal.submitVote`), `ACTION_TX.SPONSOR`, `ACTION_TX.PROCESS`, `ACTION_TX.CANCEL`
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/ActionPrimitives.tsx` — `ActionTemplate`, `VoteBox`, `VoteUpButton`, `VoteDownButton`, `GatedButton`
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/VotingBar.tsx` — yes/no vote percentage bar (shared across several action sub-components)

**Build in `haus-admin`:**
- `src/components/ProposalActions/ProposalActions.tsx` — port as above; replace `useDHConnect` with wagmi `useAccount`, `useChainId`; replace `useTxBuilder` with local tx-builder hook
- `src/components/ProposalActions/VotingPeriod.tsx`
- `src/components/ProposalActions/HasNotVoted.tsx`
- `src/components/ProposalActions/HasVoted.tsx`
- `src/components/ProposalActions/legos.ts` — copy `ACTION_TX` directly; just update the `LOCAL_ABI` import path
- Wire into `Proposal` page right-side card (alongside `ProposalHistory`)

**New UI needed:** None — action sub-components port directly from macro-ui

---

#### Op 2 — Sponsor Proposal

**Where:** `Proposal` page, right-side actions card  
**Trigger:** Direct transaction — no form lego  
**What it does:** Calls `Baal.sponsorProposal(proposalId)` for unsponsored proposals; gated by `connectedMember.delegateShares >= dao.sponsorThreshold`

**Source files to port:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/Unsponsored.tsx` — renders "Needs a Sponsor" UI with `GatedButton`; calls `fireTransaction` with `ACTION_TX.SPONSOR`

**Build in `haus-admin`:**
- `src/components/ProposalActions/Unsponsored.tsx` — port as above; already included as part of Op 1's `ProposalActions` router
- No additional UI needed

---

#### Op 3 — Process (Execute) Proposal

**Where:** `Proposal` page, right-side actions card  
**Trigger:** Direct transaction — no form lego  
**What it does:** Calls `Baal.processProposal(proposalId, proposalData)` after grace period; checks that the previous proposal in queue is also processable before enabling the button

**Source files to port:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalCard/ReadyForProcessing.tsx` — renders verdict (quorum met / not), gas estimate display, Execute button; calls `checkCanProcess` (reads contract state via viem), then `fireTransaction` with `ACTION_TX.PROCESS` + `staticArgs: [proposalId, proposalData]` + gas override

**Build in `haus-admin`:**
- `src/components/ProposalActions/ReadyForProcessing.tsx` — port as above; `createViemClient` in the existing port should map cleanly to the local keychain-utils
- Already included as part of Op 1's `ProposalActions` router

---

#### Op 4 — Cancel Proposal

**Where:** `Proposal` page, header actions area  
**Trigger:** Direct transaction — no form lego  
**What it does:** Calls `Baal.cancelProposal(proposalId)`; only shown when proposal is in `voting` status; gated by proposer, governor shaman, or sponsor below threshold

**Source files to port:**
- `monorepo/apps/admin/src/components/CancelProposal.tsx` — self-contained component; calls `fireTransaction` with `ACTION_TX.CANCEL`

**Build in `haus-admin`:**
- `src/components/CancelProposal.tsx` — port directly; replace `useDHConnect` → `useAccount`/`useChainId`, replace `useCurrentDao` → `useCurrentDao` (local hook), replace `useDaoData`/`useDaoProposal` → local dao-hooks equivalents
- Wire into `Proposal` page header `actions` slot alongside Farcaster share button

---

#### Op 5 — New Proposal (all types)

**Where:** `NewProposal` page (`/molochv3/:daochain/:daoid/new-proposal?formLego=<ID>`)  
**Trigger:** FormBuilder with form lego — no direct tx call in page  
**What it does:** Reads `formLego` query param, resolves lego from `PROPOSAL_FORMS`, renders `FormBuilder` which handles field rendering and transaction submission end-to-end

**Source files to port:**
- `monorepo/apps/admin/src/pages/NewProposal.tsx` — page; reads `formLego` param, calls `getFormLegoById`, renders `<FormBuilder>`
- `monorepo/libs/moloch-v3-legos/src/form.ts` — `PROPOSAL_FORMS` and `COMMON_FORMS` — all form lego definitions (already in `src/lib/legos/` from 5b)
- `monorepo/apps/admin/src/legos/legoConfig.tsx` — `AppFieldLookup` (maps field type strings to components); port to `src/legos/legoConfig.ts`

**Proposal form legos in scope** (all exist in `PROPOSAL_FORMS` in `monorepo/libs/moloch-v3-legos/src/form.ts`):

| Form ID | Title | Triggered from |
| --- | --- | --- |
| `SIGNAL` | Signal Request | NewProposalList |
| `ISSUE` | DAO Token Request (Issue Tokens / Add Member) | NewProposalList, Members page |
| `TRANSFER_ERC20` | ERC-20 Token Transfer (ragequittable safe) | NewProposalList, SafeActionMenu |
| `TRANSFER_ERC20_SIDECAR` | ERC-20 Token Transfer (sidecar safe) | SafeActionMenu only |
| `TRANSFER_NETWORK_TOKEN` | Network Token Transfer (ragequittable safe) | NewProposalList, SafeActionMenu |
| `TRANSFER_NETWORK_TOKEN_SIDECAR` | Network Token Transfer (sidecar safe) | SafeActionMenu only |
| `MULTICALL` | Tx Builder / Multicall (ragequittable safe) | SafeActionMenu only |
| `MULTICALL_SIDECAR` | Tx Builder / Multicall (sidecar safe) | SafeActionMenu only |
| `UPDATE_GOV_SETTINGS` | Update Governance Settings | NewProposalList |
| `TOKEN_SETTINGS` | Update Token Settings | NewProposalList |
| `TOKENS_FOR_SHARES` | Tokens for Shares | NewProposalList |
| `GUILDKICK` | Guild Kick | NewProposalList, MemberProfileMenu |
| `ADD_SHAMAN` | Add Shaman | NewProposalList |
| `CREATE_PUBLICATION` | Create Publication | NewProposalList |
| `CREATE_ARTICLE` | Create Article | NewProposalList |

> **Sidecar variants:** When a safe is non-ragequittable (a sidecar safe), the transfer and multicall proposals use `*_SIDECAR` form lego variants which include a `SAFE_SELECT` field and route through a different tx lego (`ISSUE_ERC20_SIDECAR`, `ISSUE_NETWORK_TOKEN_SIDECAR`, `MULTICALL_SIDECAR`). The `SafeActionMenu` sets `defaultValues={"safeAddress":"<addr>"}` in the URL to pre-fill the safe selector. Ensure all sidecar lego IDs are registered in `legoConfig.ts`.

**Build in `haus-admin`:**
- `src/pages/NewProposal.tsx` — port directly; replace `useCurrentDao`, `useDaoData`, `useDaoProposals` with local hooks; replace `react-query` `useQueryClient` with `@tanstack/react-query`; `getFormLegoById` comes from local legos
- `src/legos/legoConfig.ts` — port `AppFieldLookup`; references `MolochFields` from `src/lib/legos/fields/`
- After form completes → `invalidateQueries` on proposals key, navigate to proposals list

**New UI needed:**
- `src/components/NewProposalList.tsx` — proposal type picker shown as a dialog on `Proposals` page and linked from "New Proposal" button. Port from `monorepo/apps/admin/src/components/NewProposalList.tsx`. Uses a `Tabs` component (Basic / Advanced). Each item is a `RouterLink` to `/new-proposal?formLego=<ID>`. **This UI does not currently exist in `haus-admin` — add "New Proposal" button + `NewProposalList` dialog to the `Proposals` page header.**

**defaultValues pattern:** Some proposal types are pre-seeded via `?defaultValues=<JSON>` in the URL (e.g., Guild Kick pre-fills `memberAddress`). `NewProposal.tsx` reads and parses this from query params and passes to `FormBuilder`. Preserve this pattern exactly.

---

#### Op 6 — Manage Delegate

**Where:** `Members` page, per-row action menu (three-dot dropdown)  
**Trigger:** FormBuilder with `COMMON_FORMS.MANAGE_DELEGATE` lego  
**What it does:** Sets or changes delegate address on the connected member's tokens; opens in a `Dialog`

**Source files to port:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/MemberProfileMenu.tsx` — dropdown menu per member row; opens `ManageDelegate` or `ManageTokens` dialog based on `activeDialog` state
- `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/ManageDelegate.tsx` — renders `<FormBuilder form={COMMON_FORMS.MANAGE_DELEGATE} />` with `defaultValues` pre-filled from `connectedMember.delegatingTo`
- `monorepo/libs/moloch-v3-legos/src/form.ts` — `COMMON_FORMS.MANAGE_DELEGATE` lego definition

**Build in `haus-admin`:**
- `src/components/MemberProfileMenu.tsx` — port `MemberProfileMenu`; replace `useDHConnect` → `useAccount`, replace `useConnectedMember` with local hook
- `src/components/ManageDelegate.tsx` — port `ManageDelegate`; uses `FormBuilder` with local legos
- Wire into `MemberList` table rows as the last column action cell

---

#### Op 7 — Transfer DAO Tokens (Member self-transfer)

**Where:** `Members` page, per-row action menu (connected member's own row only)  
**Trigger:** FormBuilder with `COMMON_FORMS.MANAGE_TOKENS` lego  
**What it does:** Transfers the connected member's shares/loot to another address; opens in a `Dialog`

**Source files to port:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/ManageTokens.tsx` — renders `<FormBuilder form={COMMON_FORMS.MANAGE_TOKENS} />`
- `monorepo/libs/moloch-v3-legos/src/form.ts` — `COMMON_FORMS.MANAGE_TOKENS` lego definition

**Build in `haus-admin`:**
- `src/components/ManageTokens.tsx` — port `ManageTokens`; included in `MemberProfileMenu` dialog alongside `ManageDelegate`

---

#### Op 8 — Guild Kick (via proposal)

**Where:** `Members` page, per-row action menu (other members' rows)  
**Trigger:** RouterLink to `NewProposal` page — no form or direct tx in the menu itself  
**What it does:** Navigates to `/new-proposal?formLego=GUILDKICK&defaultValues={"memberAddress":"<addr>"}` which pre-fills the Guild Kick form with the target member address

**Source files:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/MemberProfileCard/MemberProfileMenu.tsx` — the "Guild Kick" item is a `RouterLink` with pre-built query params; no separate component needed

**Build in `haus-admin`:**
- Already covered by `MemberProfileMenu` (Op 6) and `NewProposal` page (Op 5); no additional work beyond ensuring the `GUILDKICK` lego ID is wired in `legoConfig`

---

#### Op 9 — Add Member (via proposal shortcut)

**Where:** `Members` page, header "Add Member" button  
**Trigger:** RouterLink — no form or direct tx on this page  
**What it does:** Navigates to `/new-proposal?formLego=ISSUE` to submit an Issue Tokens proposal

**Source files:**
- `monorepo/apps/admin/src/pages/Members.tsx` — "Add Member" button is a `<ButtonRouterLink to="...new-proposal?formLego=ISSUE">`

**Build in `haus-admin`:**
- Add to `Members` page header — a single `RouterLink`-styled button. No separate component needed.

---

#### Op 10 — Rage Quit

**Where:** `RageQuit` page (`/molochv3/:daochain/:daoid/ragequit`)  
**Trigger:** FormBuilder with `COMMON_FORMS.RAGEQUIT` lego  
**What it does:** Lets connected member burn their shares/loot to withdraw proportional token balances from the treasury safe; pre-fills token list from the primary vault's current balances

**Source files to port:**
- `monorepo/apps/admin/src/pages/RageQuit.tsx` — page; builds `defaultFields` from `connectedMember` + `dao.vaults` (primary safe token balances), passes to `<FormBuilder form={COMMON_FORMS.RAGEQUIT} />`
- `monorepo/libs/moloch-v3-legos/src/form.ts` — `COMMON_FORMS.RAGEQUIT` lego
- `monorepo/libs/moloch-v3-fields/src/` — `sortTokensForRageQuit` utility (already in `src/lib/legos/fields/` from 5b)

**Build in `haus-admin`:**
- `src/pages/RageQuit.tsx` — port directly; replace hooks with local equivalents; `sortTokensForRageQuit` comes from `src/lib/legos/fields/`
- `defaultFields` pattern: pre-fill `to` with connected member address, `tokens` with sorted token address list from primary vault (filter to `balance > 0`)
- On `onPollSuccess`: refetch dao, member, and members list

**New UI needed:** `RageQuit` is linked from `MemberProfileMenu` ("Rage Quit" item). The link exists in the menu but the route and page need to be wired. **Confirm the route `/molochv3/:daochain/:daoid/ragequit` is in the router (it is listed in Phase 1 routing) and the page component is connected.**

---

#### Op 11 — Update DAO Settings (Metadata)

**Where:** `UpdateSettings` page (`/molochv3/:daochain/:daoid/settings/update`)  
**Trigger:** FormBuilder with `COMMON_FORMS.METADATA_SETTINGS` lego  
**What it does:** Posts updated DAO metadata (name, description, avatar, tags, links) to the Poster contract via a proposal; pre-fills all fields from current DAO data

**Source files to port:**
- `monorepo/apps/admin/src/pages/UpdateSettings.tsx` — page; `formatDaoProfileForForm(dao)` maps DAO fields to form field names (`icon`, `tags`, `discord`, `github`, etc.); passes to `<FormBuilder form={COMMON_FORMS.METADATA_SETTINGS} />`
- `monorepo/libs/moloch-v3-legos/src/form.ts` — `COMMON_FORMS.METADATA_SETTINGS` lego

**Build in `haus-admin`:**
- `src/pages/UpdateSettings.tsx` — port directly; keep `formatDaoProfileForForm` as a local helper in the same file; replace hooks with local equivalents
- On `onPollSuccess`: refetch dao, navigate back to `/settings`

**New UI needed:** The "Edit Settings" button on the `Settings` page should link to `UpdateSettings`. **Add this button to the `Settings` page — it is a stub in Phase 4 and needs to be wired here.**

---

#### Op 12 — Add Safe

**Where:** `Safes` page, "New Safe" button → `Dialog`  
**Trigger:** FormBuilder with `COMMON_FORMS.ADD_SAFE` lego  
**What it does:** Creates a proposal to register a new Gnosis Safe with the DAO

**Source files to port:**
- `monorepo/apps/admin/src/pages/Safes.tsx` — wraps `AddSafeForm` in a `Dialog`; "New Safe" button only shown if `connectedMember` exists
- `monorepo/apps/admin/src/components/AddSafeForm.tsx` — renders `<FormBuilder form={COMMON_FORMS.ADD_SAFE} />`; on `onPollSuccess` refetches dao and closes dialog via `onSuccess` callback
- `monorepo/libs/moloch-v3-legos/src/form.ts` — `COMMON_FORMS.ADD_SAFE` lego

**Build in `haus-admin`:**
- `src/components/AddSafeForm.tsx` — port directly; replace hooks with local equivalents
- Wire into `Safes` page as a `Dialog` triggered by the "New Safe" button; pass `onSuccess={() => setOpen(false)}` to form

---

#### Op 13 — Safe Card Action Menu (Transfer & Tx Builder shortcuts)

**Where:** `Safes` page, per-card three-dot dropdown (one menu per safe card)  
**Trigger:** RouterLinks — no direct tx or form on this component itself; routes to `NewProposal` with correct `formLego` + `defaultValues`  
**What it does:** Provides three proposal shortcuts from each safe card:
- **Transfer ERC-20** → routes to `TRANSFER_ERC20` (ragequittable) or `TRANSFER_ERC20_SIDECAR` (sidecar, pre-fills `safeAddress`)
- **Transfer [native token]** → routes to `TRANSFER_NETWORK_TOKEN` or `TRANSFER_NETWORK_TOKEN_SIDECAR` (pre-fills `safeAddress`)
- **Tx Builder** → routes to `MULTICALL` or `MULTICALL_SIDECAR` (pre-fills `safeAddress`)

The ragequittable vs. sidecar branch is determined by `safe.ragequittable`. The native token symbol shown in the menu label (e.g., "Transfer ETH", "Transfer xDAI") is read from `getNetwork(daoChain).symbol`.

**Source files to port:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/SafeCard/SafeActionMenu.tsx` — dropdown menu; three `RouterLink`-based items; all routing, no tx logic in this component
- `monorepo/libs/moloch-v3-macro-ui/src/components/SafeCard/SafeCard.styles.ts` — `SafeActionMenuLink`, `SafeActionMenuTrigger` styled components used in the menu

**Build in `haus-admin`:**
- `src/components/SafeActionMenu.tsx` — port `SafeActionMenu`; replace `useDHConnect` → `useAccount`; replace `getNetwork` import path to local keychain-utils
- Wire into `SafeCard` component — the menu is already stubbed out in Phase 4g; in Phase 5 replace the stub with the real `SafeActionMenu`, gated by `includeLinks && connectedAddress`
- No new page needed — all three actions route through the existing `NewProposal` page (Op 5)

> **Note:** This op is essentially free once Op 5 (`NewProposal`) and the sidecar lego variants are in place. The only work is porting the dropdown component itself.

---

#### Op 14 — Transaction Builder (Multicall Proposal)

**Where:** `NewProposal` page, rendered when `formLego=MULTICALL` or `formLego=MULTICALL_SIDECAR`  
**Trigger:** FormBuilder with `MULTICALL_BUILDER` / `MULTICALL_BUILDER_SIDECAR` lego  
**What it does:** A multi-step form that lets users compose arbitrary contract calls into a single multisend proposal. Each action row lets the user enter a contract address, fetches its ABI from Etherscan, selects a function, and fills in arguments. The resulting encoded calldata is submitted as a multicall proposal.

This is the most complex field in the system — it has its own sub-form, ABI fetching, ABI caching, and encoding logic all inside a single custom field component.

**Source files to port:**
- `monorepo/libs/moloch-v3-fields/src/fields/MultisendActions.tsx` — the `multisendActions` custom field; includes:
  - Per-action rows with address input, ABI fetch (`fetchABI`, `getCode` from tx-builder), function selector, argument inputs
  - `cacheABI` for deduplication
  - Uses `CollapsibleFormSegment` layout (also in moloch-v3-fields custom layouts)
  - `JsonFragment`, `ABI` types from `@daohaus/utils`
- `monorepo/libs/moloch-v3-fields/src/config/fieldConfig.ts` — registers `multisendActions` as a field type in `MolochFields`; already pulled in via `src/lib/legos/fields/` from 5b, but **verify `multisendActions` key is present**
- `monorepo/libs/moloch-v3-legos/src/form.ts` — `MULTICALL_BUILDER` (id: `'MULTICALL'`) and `MULTICALL_BUILDER_SIDECAR` (id: `'MULTICALL_SIDECAR'`) lego definitions; already in `src/lib/legos/` from 5b
- `monorepo/libs/moloch-v3-legos/src/tx.ts` — `TX.MULTICALL` and `TX.MULTICALL_SIDECAR` tx lego definitions; already in `src/lib/legos/` from 5b

**Dependencies from tx-builder (already ported in 5a):**
- `fetchABI(address, chainId)` — Etherscan ABI lookup; **update to Etherscan v2 endpoint** using `VITE_ETHERSCAN_KEY`
- `getCode(address, chainId)` — checks if address is a contract
- `cacheABI(address, abi)` — in-memory ABI cache

**Build in `haus-admin`:**
- `MultisendActions` field is already part of `MolochFields` in `src/lib/legos/fields/` — verify it compiles and that `multisendActions` appears in `fieldConfig.ts`
- `src/legos/legoConfig.ts` — `AppFieldLookup` inherits from `MolochFields`; no extra registration needed beyond what's already there
- Ensure `MULTICALL` and `MULTICALL_SIDECAR` are resolvable by `getFormLegoById` in the local legos

**Etherscan v2 update required:** `fetchABI` in the ported tx-builder will use an Etherscan v1-style URL. Update it to:
```
https://api.etherscan.io/v2/api?chainid={numericChainId}&module=contract&action=getabi&address={addr}&apikey={VITE_ETHERSCAN_KEY}
```
This is the same Etherscan v2 migration noted in Phase 6 — do it here since the tx builder depends on it directly.

---

#### Op 15 — Proposal Action Data Decoding (complete Phase 4 stub)

**Where:** `Proposal` detail page, left card, below proposal description  
**Trigger:** Read-only display — no transaction; decodes `proposal.proposalData` on mount using tx-builder  
**What it does:** Decodes the encoded calldata of a proposal into human-readable actions (target address, function name, parameter names/types/values). Required tx-builder to be in place before this could be implemented — deferred in Phase 4d.

**Source files to port:**
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalDetails/ProposalDetailsContainer.tsx` — orchestrates decoding; calls `deepDecodeProposalActions({ chainId, actionData: proposal.proposalData })` from tx-builder; passes decoded result to both `ProposalDetails` and `ProposalActionData`
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalActionData/ProposalActionData.tsx` — renders decoded actions list; each action is collapsible; shows target address, value, and decoded params; handles `ActionError` gracefully
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalActionData/ValueDisplay.tsx` — renders individual param values; handles address, bytes, tuple, array types; links addresses to block explorer
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalActionData/ActionAlert.tsx` — warns when a decoded action matches a sensitive proposal type (e.g., a multicall that calls `setAdminOnly`)
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalActionData/ProposalWarning.tsx` — fallback shown when `decodeError` is true; links to raw tx on explorer
- `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalActionData/ProposalActionData.styles.ts` — styled-components for the action data panel

**From tx-builder (already ported in 5a):**
- `deepDecodeProposalActions` — the main decoding function; recursively decodes multisend payloads and nested calls
- `DeepDecodedMultiTX`, `DeepDecodedAction`, `ActionError`, `isActionError` — types used throughout

**From utils (already ported in Phase 3):**
- `SENSITIVE_PROPOSAL_TYPES`, `DAO_METHOD_TO_PROPOSAL_TYPE`, `PROPOSAL_TYPE_WARNINGS` — config for `ProposalActionConfig`

**Build in `haus-admin`:**
- `src/components/ProposalActionData/ProposalActionData.tsx`
- `src/components/ProposalActionData/ValueDisplay.tsx`
- `src/components/ProposalActionData/ActionAlert.tsx`
- `src/components/ProposalActionData/ProposalWarning.tsx`
- Update `src/pages/Proposal.tsx` (or the `ProposalDetailsContainer` equivalent): add `deepDecodeProposalActions` call in a `useEffect`, pass decoded `actionData` down to `ProposalActionData`

**Note:** In Phase 4d, `ProposalDetailsContainer` was listed as the source for the proposal detail layout. The Phase 4 port covered the read-only display (`ProposalDetails`, vote counts, timeline) but left action decoding as a stub. In Phase 5, complete the wiring: add the `useEffect` decode call and render `ProposalActionData` below the proposal details.

---

**Testable:** Each operation tested individually on Sepolia testnet. Verify: transaction signs and submits, toast lifecycle fires (pending → success/error), subgraph polling triggers refetch, UI updates to reflect new state. For Op 14 (Tx Builder): verify ABI fetch works via Etherscan v2, a simple ETH transfer multicall proposal can be created. For Op 15: verify action data decodes correctly on known proposal types (ISSUE, TRANSFER_ERC20, MULTICALL).

---

## Phase 6 — Polish & Modernization

**Goal:** Cross-cutting improvements, error handling, UX polish.

1. **Error boundaries** — Per-page error boundaries with meaningful messages

2. **Loading states** — Consistent skeleton loaders during data fetching; avoid layout shift

3. **Toast notifications** — Port `useToast` from UI lib; fire on tx success/error/pending

4. **Empty states** — Meaningful empty state UI for: no DAOs found, no proposals, no members

5. **Mobile responsiveness** — Audit all pages on mobile viewports; breakpoint hooks are already in the UI lib

6. **Etherscan v2 block explorer links** — Update `explorerUtils.ts` in keychain-utils to use the Etherscan v2 API endpoint:

   ```
   https://api.etherscan.io/v2/api?chainid={numericChainId}&module=...&apikey={singleKey}
   ```

   This replaces 6 separate API keys with one key covering all EVM chains Etherscan supports.

7. **Proposal status helper** — Ensure proposal status calculation (active, voting, grace, passed, failed, cancelled, needsProcessing) is accurate and well-typed. Port from `monorepo/libs/moloch-v3-data/src/utils/proposalsStatus.ts`.

8. **URL sharing / deep linking** — Ensure all DAO and proposal URLs are shareable and load correctly without wallet connection.

9. **Farcaster share** — The current admin has a "Share on Farcaster" button on proposal detail. Keep this; it's a static compose link with no library dependency.

10. **React Query config tuning** — Appropriate `staleTime` and `gcTime` per entity type:
    - DAO data: 2 min stale, 10 min gc
    - Proposals: 30 sec stale (actively voting)
    - Members: 2 min stale
    - Token balances: 1 min stale

11. **Environment variable validation** — Fail fast at startup if required env vars are missing. Small `src/lib/env.ts` module that reads and validates all env vars.

---

## Open Questions

Remaining items to resolve during implementation:

1. **Poster contract:** Metadata updates and signal proposals use the Poster contract. The contract address is in `moloch-v3-legos/gnosisModule.json` and `CONTRACT_KEYCHAINS`. Confirm Poster is deployed on all supported chains (including mainnet) and the addresses are current before building Phase 5.

2. **Graph API key:** The `haus-dao-hooks` uses a single `graphKey` for all chains via the Arbitrum gateway. Confirm whether the existing `NX_GRAPH_API_KEY_MAINNET` from the monorepo is the right key to carry over, or if a new key should be created for this app.

3. **Mainnet subgraph ID:** Locate the deployed Ethereum mainnet DAOHAUS subgraph ID to add in Phase 2, step 5. Check the Graph dashboard or `monorepo/apps/moloch-v3-subgraph/` deploy history.

4. **Gnosis Safe API chain coverage:** Verify the Safe Transaction Service supports all chains we target before committing to it over the Sequence Indexer in Phase 4g. Specifically confirm Gnosis chain (`0x64`) availability.

**Resolved decisions:**

- ✅ Alchemy covers Gnosis chain — no fallback needed
- ✅ URL scheme stays `/molochv3/:daochain/:daoid` — no migration needed
- ✅ Mainnet DAOs are in scope — subgraph ID to be added in Phase 2
- ✅ ENS resolution via wagmi `useEnsName` / `useEnsAvatar`
- ✅ All 11 proposal types are in scope for launch
- ✅ Sequence wallet not needed — RainbowKit default wallet list is sufficient

---

## Modernization Issues Identified

Beyond the explicit migration requirements, these issues were found during review and should be addressed:

### Dependency Upgrades

| Issue                      | Current | Target      | Risk                                                          |
| -------------------------- | ------- | ----------- | ------------------------------------------------------------- |
| `wagmi` v1 → v2            | 1.3.8   | 2.x         | High — full API rewrite, all wallet/chain hooks change        |
| `ethers` v5 → v6           | 5.7.2   | 6.x         | High — BigNumber → bigint, namespace flattening               |
| `react-query` v3 → v5      | 3.39.3  | 5.x         | Medium — `useQuery` signature changed, `cacheTime` → `gcTime` |
| `react-router-dom` v6 → v7 | 6.4.1   | 7.x         | Low — mostly compatible                                       |
| `viem` v1 → v2             | 1.3.0   | 2.x         | Medium — some API changes                                     |
| `storybook` 6 → removed    | 6.5.9   | removed     | Low — only in UI lib                                          |
| `styled-components` v6     | 6.0.0   | 6.x current | Low — already on v6                                           |

### Architecture Issues

- **`@daohaus/moloch-v3-macro-ui` dependency** — The current admin uses pre-built macro components (`DaoOverview`, `DaoSettings`, `MemberList`, etc.) from this package. In the new app we don't bring this package over — we build these as regular page components. This is actually a simplification, but means we need to replicate the logic that's currently inside those macro components. Review `monorepo/libs/moloch-v3-macro-ui/src/` to understand exactly what each macro component does before building the page equivalents.

- **Multiple wallet library overlap** — The monorepo uses wagmi, viem, ethers, WalletConnect, and Sequence Kit simultaneously. Eliminating Sequence Kit (not needed), consolidating on wagmi v2 + viem v2 for all chain interactions, and using ethers only where the tx-builder requires it reduces this surface significantly.

- **react-query v3 cache keys** — The old hooks use string-based query keys (`['dao', daoId, chainId]`). TanStack Query v5 is compatible but prefers array keys. The haus-dao-hooks already uses v5 patterns — stay consistent.

- **NX module boundary enforcement** — The monorepo enforces strict import boundaries via ESLint. In the new app everything is local source — no module boundaries needed, but we should maintain clear folder conventions.

- **`MULTI_DAO_ROUTER` constant** — The old routing used a shared constant from `moloch-v3-hooks` to define the nested DAO route path. Not needed in the new app — just define routes directly.

- **Proposal form `defaultValues` pattern** — Several proposal forms pre-fill with data (e.g., rage quit pre-fills member's token balances, guild kick pre-fills member address). This pattern needs to work with the ported FormBuilder. Document the `defaultValues` prop pattern clearly when porting.

- **Polling after transactions** — The tx-builder polls the subgraph after a transaction confirms to detect when the subgraph has indexed the new state, then triggers data refetch. This pattern is important for UX (showing updated state immediately after a proposal is created/voted on). Ensure the polling logic is preserved during tx-builder port.

### Code Quality

- **TypeScript strict mode** — The monorepo has TypeScript 5 but the tsconfig may not be fully strict. Enable `strict: true` from the start in the new app.
- **`any` types** — The lego system uses `any` in several places (field values, argument builders). We can tighten these using generics where feasible, but avoid blocking progress — flag them and address iteratively.
- **Stale `Goerli` references** — The monorepo keychain includes Goerli (`0x5`) which was deprecated and shut down. Replace with Sepolia (`0xaa36a7`) consistently. The `haus-dao-hooks` already uses Sepolia.

---

## Implementation Notes

### Running the Old App for Reference

While building, keep the old monorepo admin running for visual and behavioral reference:

```bash
cd monorepo
yarn install
yarn nx serve admin
```

### Testing Strategy

- **Phase 4 (read):** Manual testing against Sepolia testnet DAOs + Arbitrum mainnet DAOs
- **Phase 5 (write):** Test all transaction flows on Sepolia testnet with a test DAO
- **No automated tests initially** — the monorepo's Jest tests are for the library packages we're porting. Add unit tests for proposal status calculation logic; rely on manual testing for the rest in the initial phase.

### Keeping haus-dao-hooks in Sync

The `haus-dao-hooks` directory is the canonical source. If subgraph queries need changes (new fields, new entities) during development:

1. Update `haus-dao-hooks/src/utils/queries.ts`
2. Copy the updated file to `src/lib/dao-hooks/utils/queries.ts`
3. Update types in `types.ts` correspondingly

Eventually, the dao-hooks code living in `src/lib/dao-hooks/` becomes the source of truth for this app and `haus-dao-hooks/` is just a reference.

---

_Plan written: April 2026. Updated to reflect resolved decisions on routing, mainnet support, ENS, proposal scope, and wallet options._
