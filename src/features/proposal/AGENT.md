# Proposal Feature Guide

## Purpose

`src/features/proposal` owns proposal-focused UI for listing proposals, inspecting proposal detail, rendering action data, and exposing state-dependent proposal actions.

This folder should hold proposal-specific presentation and workflow logic. Generic DAO fetching belongs in `src/lib/dao-hooks`, and shared transaction infrastructure belongs in `src/lib/tx-builder`.

## Key Entry Points

- Proposal list route: [`../../app/routes/Proposals.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/routes/Proposals.tsx:1)
- Proposal detail route: [`../../app/routes/Proposal.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/routes/Proposal.tsx:1)
- New proposal route: [`../../app/routes/NewProposal.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/app/routes/NewProposal.tsx:1)
- List UI: [`components/ProposalList.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/components/ProposalList.tsx:1)
- Detail card and history:
  [`components/ProposalDetailCard.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/components/ProposalDetailCard.tsx:1) and [`components/ProposalHistory.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/components/ProposalHistory.tsx:1)
- Action surfaces:
  [`components/ProposalActions/ProposalActions.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/components/ProposalActions/ProposalActions.tsx:1)
- Decoded transaction display:
  [`components/ProposalActionData/ProposalActionData.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/proposal/components/ProposalActionData/ProposalActionData.tsx:1)

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

- Shared DAO queries: [`../../lib/dao-hooks/index.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/dao-hooks/index.ts:1)
- Shared tx execution and decoding: [`../../lib/tx-builder/TXBuilder.tsx`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/tx-builder/TXBuilder.tsx:1)
- Shared proposal form definitions: [`../../lib/legos/index.ts`](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/legos/index.ts:1)
- Member-related proposal interactions: [`../member/AGENT.md`](/home/skuhl/Documents/ody/haus/haus-admin/src/features/member/AGENT.md:1)
- System overview: [`../../../../docs/ARCHITECTURE.md`](/home/skuhl/Documents/ody/haus/haus-admin/docs/ARCHITECTURE.md:1)
