# Proposal Feature Guide

## Purpose

`src/features/proposal` owns proposal-focused UI for listing proposals, inspecting proposal detail, rendering action data, and exposing state-dependent proposal actions.

This folder should hold proposal-specific presentation and workflow logic. Generic DAO fetching belongs in `src/lib/dao-hooks`, and shared transaction infrastructure belongs in `src/lib/tx-builder`.

## Key Entry Points

- Proposal list route: [`../../app/routes/Proposals.tsx`](../../app/routes/Proposals.tsx)
- Proposal detail route: [`../../app/routes/Proposal.tsx`](../../app/routes/Proposal.tsx)
- New proposal route: [`../../app/routes/NewProposal.tsx`](../../app/routes/NewProposal.tsx)
- List UI: [`components/ProposalList.tsx`](components/ProposalList.tsx)
- Detail card and history:
  [`components/ProposalDetailCard.tsx`](components/ProposalDetailCard.tsx) and [`components/ProposalHistory.tsx`](components/ProposalHistory.tsx)
- Action surfaces:
  [`components/ProposalActions/ProposalActions.tsx`](components/ProposalActions/ProposalActions.tsx)
- Decoded transaction display:
  [`components/ProposalActionData/ProposalActionData.tsx`](components/ProposalActionData/ProposalActionData.tsx)

## Common Tasks

- Change proposal list filtering, paging, or empty states:
  start in `components/ProposalList.tsx`
- Change proposal detail layout or side panels:
  start in `src/app/routes/Proposal.tsx` and `components/ProposalDetailCard.tsx`
- Change status-specific action behavior:
  inspect `components/ProposalActions/`
- Change rendered action payload details:
  inspect `components/ProposalActionData/`
- Change proposal creation entrypoints:
  inspect `src/app/routes/Proposals.tsx`, `src/app/routes/NewProposal.tsx`, and `@/lib/legos`

## Guardrails

- Keep proposal-specific status rendering and action UI inside this feature.
- Shared proposal fetching should stay in `@/lib/dao-hooks`.
- Deep decode and transaction execution infrastructure should stay in `@/lib/tx-builder`.
- Proposal form definitions and reusable form-building pieces should stay in `@/lib/legos` or `@/lib/form-builder`.

## Related Areas

- Shared DAO queries: [`../../lib/dao-hooks/index.ts`](../../lib/dao-hooks/index.ts)
- Shared tx execution and decoding: [`../../lib/tx-builder/TXBuilder.tsx`](../../lib/tx-builder/TXBuilder.tsx)
- Shared proposal form definitions: [`../../lib/legos/index.ts`](../../lib/legos/index.ts)
- Member-related proposal interactions: [`../member/AGENT.md`](../member/AGENT.md)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
