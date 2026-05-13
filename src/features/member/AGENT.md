# Member Feature Guide

## Purpose

`src/features/member` owns member-focused UI for the DAO members table, member profile screens, token balances, and member-oriented management surfaces.

This folder should contain member-specific presentation and interaction logic. Shared member fetching belongs in `src/lib/dao-hooks`, while routing and shell context stay in `src/app`.

## Key Entry Points

- Members list route: [`../../app/routes/Members.tsx`](../../app/routes/Members.tsx)
- Member detail route: [`../../app/routes/Member.tsx`](../../app/routes/Member.tsx)
- List UI: [`components/MemberList.tsx`](components/MemberList.tsx)
- Row rendering:
  [`components/MemberRow.tsx`](components/MemberRow.tsx)
- Profile surfaces:
  [`components/MemberProfile.tsx`](components/MemberProfile.tsx), [`components/MemberTokens.tsx`](components/MemberTokens.tsx), and [`components/MemberStats.tsx`](components/MemberStats.tsx)

## Common Tasks

- Change members table sorting, paging, or overview metrics:
  start in `components/MemberList.tsx`
- Change row-level actions or navigation:
  inspect `components/MemberRow.tsx` and `components/MemberMenu.tsx`
- Change member profile composition:
  start in `src/app/routes/Member.tsx`
- Change member token or stats displays:
  inspect `components/MemberTokens.tsx` and `components/MemberStats.tsx`
- Change how new-member onboarding links into proposal creation:
  inspect `src/app/routes/Members.tsx` and `src/app/routes/NewProposal.tsx`

## Guardrails

- Keep member-specific table and profile UI in this feature.
- Shared DAO or member queries should stay in `@/lib/dao-hooks`.
- Route-param and current-DAO helpers should stay in `@/app/hooks`.
- If a change is really a proposal-creation flow, prefer documenting or implementing it in `src/features/proposal` or the shared form/lego layers rather than here.

## Related Areas

- Shared DAO/member queries: [`../../lib/dao-hooks/index.ts`](../../lib/dao-hooks/index.ts)
- Route DAO context: [`../../app/hooks/useCurrentDao.ts`](../../app/hooks/useCurrentDao.ts)
- Proposal flow for adding members: [`../proposal/AGENT.md`](../proposal/AGENT.md)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
