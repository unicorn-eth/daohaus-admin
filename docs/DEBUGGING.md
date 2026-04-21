# Debugging Guide

## Purpose

Use this guide to turn a bug report into likely starting files. It is intentionally symptom-oriented and links back to local guides for deeper context.

## First Pass

1. Identify the user-visible route in [`src/router.tsx`](../src/router.tsx).
2. Open the matching file in [`src/app/routes`](../src/app/routes/Summon.tsx).
3. Read the nearest local `AGENT.md` for that feature or library.
4. Trace read flows through `@/lib/dao-hooks`.
5. Trace write flows through feature utils, `@/lib/legos`, `@/lib/form-builder`, and `@/lib/tx-builder`.
6. Check verification guidance in [`docs/VERIFICATION.md`](VERIFICATION.md).

## DAO Route Does Not Load

- Start with [`src/app/layouts/DaoContainer.tsx`](../src/app/layouts/DaoContainer.tsx) and [`src/app/hooks/useCurrentDao.ts`](../src/app/hooks/useCurrentDao.ts).
- Check route params in [`src/router.tsx`](../src/router.tsx).
- Check DAO fetching in [`src/lib/dao-hooks/hooks/useDao.ts`](../src/lib/dao-hooks/hooks/useDao.ts).
- If the failure is network-specific, inspect [`src/lib/keychain-utils/AGENT.md`](../src/lib/keychain-utils/AGENT.md).
- Verify with `npm run build` and a manual DAO route load.

## Proposal List Or Detail Data Is Wrong

- Start with [`src/app/routes/Proposals.tsx`](../src/app/routes/Proposals.tsx) or [`src/app/routes/Proposal.tsx`](../src/app/routes/Proposal.tsx).
- Check proposal UI in [`src/features/proposal/AGENT.md`](../src/features/proposal/AGENT.md).
- Check shared queries in [`src/lib/dao-hooks/hooks/useDaoProposals.ts`](../src/lib/dao-hooks/hooks/useDaoProposals.ts) and [`src/lib/dao-hooks/hooks/useProposal.ts`](../src/lib/dao-hooks/hooks/useProposal.ts).
- Inspect query helpers in [`src/lib/dao-hooks/utils/queries.ts`](../src/lib/dao-hooks/utils/queries.ts).
- Verify list, detail, loading, empty, and error states.

## Proposal Action Data Or Decoding Is Wrong

- Start with [`src/features/proposal/components/ProposalActionData/ProposalActionData.tsx`](../src/features/proposal/components/ProposalActionData/ProposalActionData.tsx).
- Check decode helpers in [`src/lib/tx-builder/utils/decoding.ts`](../src/lib/tx-builder/utils/decoding.ts) and [`src/lib/tx-builder/utils/deepDecoding.ts`](../src/lib/tx-builder/utils/deepDecoding.ts).
- Check ABI and contract metadata in [`src/lib/abis`](../src/lib/abis/index.ts) and [`src/lib/keychain-utils`](../src/lib/keychain-utils/index.ts).
- Verify against a known proposal with action data.

## Proposal Action Button State Is Wrong

- Start with [`src/features/proposal/components/ProposalActions/ProposalActions.tsx`](../src/features/proposal/components/ProposalActions/ProposalActions.tsx).
- Inspect the status-specific components in [`src/features/proposal/components/ProposalActions`](../src/features/proposal/components/ProposalActions/ProposalActions.tsx).
- Check proposal status helpers in [`src/lib/utils/utils/proposalStatus.ts`](../src/lib/utils/utils/proposalStatus.ts).
- If wallet/member status matters, inspect [`src/features/dao/hooks/useConnectedMember.ts`](../src/features/dao/hooks/useConnectedMember.ts).
- Verify with proposals in multiple states when possible.

## Summon Transaction Fails

- Start with [`src/app/routes/Summon.tsx`](../src/app/routes/Summon.tsx).
- Check the main form in [`src/features/summon/components/SummonerForm.tsx`](../src/features/summon/components/SummonerForm.tsx).
- Check validation in [`src/features/summon/utils/validation.ts`](../src/features/summon/utils/validation.ts).
- Check tx assembly in [`src/features/summon/utils/transactions.ts`](../src/features/summon/utils/transactions.ts).
- Check network and contract metadata in [`src/lib/keychain-utils/AGENT.md`](../src/lib/keychain-utils/AGENT.md).
- Verify form validation, wallet network, and submitted tx args.

## Safe Balances Or Safe Proposals Are Wrong

- Start with [`src/app/routes/Safes.tsx`](../src/app/routes/Safes.tsx).
- Read [`src/features/safe/AGENT.md`](../src/features/safe/AGENT.md).
- Check balance fetching in [`src/features/safe/hooks/useSafeBalances.ts`](../src/features/safe/hooks/useSafeBalances.ts).
- Check shared vault/record data in [`src/lib/dao-hooks`](../src/lib/dao-hooks/index.ts).
- For proposal shortcuts, inspect [`src/features/safe/components/SafeActionMenu.tsx`](../src/features/safe/components/SafeActionMenu.tsx) and [`src/lib/legos/AGENT.md`](../src/lib/legos/AGENT.md).
- Verify both empty and populated Safe states.

## Member List Or Member Detail Is Stale Or Incorrect

- Start with [`src/app/routes/Members.tsx`](../src/app/routes/Members.tsx) or [`src/app/routes/Member.tsx`](../src/app/routes/Member.tsx).
- Read [`src/features/member/AGENT.md`](../src/features/member/AGENT.md).
- Check member queries in [`src/lib/dao-hooks/hooks/useDaoMembers.ts`](../src/lib/dao-hooks/hooks/useDaoMembers.ts) and [`src/lib/dao-hooks/hooks/useMember.ts`](../src/lib/dao-hooks/hooks/useMember.ts).
- Check table/profile rendering in [`src/features/member/components`](../src/features/member/components/MemberList.tsx).
- Verify sorting, pagination, profile fields, and token displays.

## Settings Update Form Submits The Wrong Transaction

- Start with [`src/app/routes/UpdateSettings.tsx`](../src/app/routes/UpdateSettings.tsx).
- Read [`src/features/settings/AGENT.md`](../src/features/settings/AGENT.md).
- Check form definitions in [`src/lib/legos/form.ts`](../src/lib/legos/form.ts) and tx definitions in [`src/lib/legos/tx.ts`](../src/lib/legos/tx.ts).
- Check generic submit behavior in [`src/lib/form-builder/FormBuilder.tsx`](../src/lib/form-builder/FormBuilder.tsx).
- Check tx argument resolution in [`src/lib/tx-builder/utils/args.ts`](../src/lib/tx-builder/utils/args.ts).
- Verify default values, submitted form values, and final tx args.

## Wallet Or Network State Behaves Unexpectedly

- Start with [`src/main.tsx`](../src/main.tsx) and [`src/lib/wagmi-config.ts`](../src/lib/wagmi-config.ts).
- Check environment values in [`docs/ENVIRONMENT.md`](ENVIRONMENT.md).
- Check network metadata in [`src/lib/keychain-utils/AGENT.md`](../src/lib/keychain-utils/AGENT.md).
- If route context is affected, inspect [`src/app/hooks/useCurrentDao.ts`](../src/app/hooks/useCurrentDao.ts).
- Verify with a connected wallet, expected network, and missing-env warning behavior.
