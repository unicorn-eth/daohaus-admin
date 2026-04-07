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
  - Governance settings: voting period, grace period, quorum, etc.
  - Safes list summary
  - Shamans list
- **Components to build:** `DaoOverviewCard`, `DaoStats`, `GovernanceParams`
- **Types:** `DaoItem`, `VaultItem`, `ShamanItem`
- **Source files:**
  - `monorepo/apps/admin/src/pages/DaoOverview.tsx` — page entry point (thin wrapper, delegates entirely to macro-ui)
  - `monorepo/libs/moloch-v3-macro-ui/src/components/DaoOverview/DaoOverview.tsx` → `DaoOverviewCard` (contains stats, governance params, safes, and shamans summary inline)
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
  - `monorepo/libs/moloch-v3-macro-ui/src/components/ProposalActionData/ProposalActionData.tsx` — decoded proposal action data display

### 4e. Members List

Replicate `Members` — all members of a DAO.

- **Data:** `useDaoMembers({ chainid, daoid })`
- **Features:**
  - Member list with address, shares, loot, delegate info
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

If the Safe API is unavailable for a chain, fall back to the Sequence Indexer. Keep `0xsequence` in package.json until the fallback decision is confirmed and tested across all supported chains.

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

Build each write operation as a form using the ported FormBuilder + TXBuilder:

**Proposal creation** (`NewProposal` page):

- Load form lego by `formLego` URL query param
- All proposal types in scope for launch: Signal, Issue (Issue Token), Transfer ERC20, Transfer Network Token, Update Gov Settings, Token Settings, Tokens for Shares, Guild Kick, Add Shaman, Create Publication, Create Article
- `NewProposalList` dialog to choose proposal type

**Voting** (`Proposal` page):

- Yes/No vote buttons with confirmation
- Sponsor unsponsored proposals (if eligible)
- Process passed proposals after grace period
- Cancel own proposals

**Member actions** (`Members` page):

- Add Member → Issue proposal shortcut
- Manage delegate

**Rage Quit** (`RageQuit` page):

- Token selection with amounts
- Submit rage quit transaction

**Settings update** (`UpdateSettings` page):

- FormBuilder with `METADATA_SETTINGS` form lego
- Posts metadata update to Poster contract

**Safe management** (`Safes` page):

- Add Safe dialog (`AddSafeForm`)

**Testable:** Each form submits a transaction on a testnet, lifecycle (sign → pending → confirmed → poll) works correctly.

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
