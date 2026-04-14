import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { formatShares, roundedPercentage } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate, Verdict } from './ActionPrimitives';
import { VoteBar } from '../VoteBar';

export const Passed = ({ proposal }: { proposal: ProposalItem }) => {
  const { address } = useAccount();

  const userVoteData = useMemo(() => {
    if (!address || !proposal.votes) return undefined;
    return proposal.votes.find(
      (v) => v.member?.memberAddress?.toLowerCase() === address.toLowerCase()
    );
  }, [address, proposal.votes]);

  const percentYes = roundedPercentage(
    Number(proposal.yesBalance),
    Number(proposal.dao.totalShares)
  );

  const userVoteDisplay =
    userVoteData &&
    `You voted ${userVoteData.approved ? 'Yes' : 'No'} (${formatShares(userVoteData.balance)})`;

  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay="Proposal Passed"
      main={
        <>
          <VoteBar proposal={proposal} />
          <Verdict passed={true} appendText={` - ${percentYes}% Yes`} />
        </>
      }
      helperDisplay={userVoteDisplay}
    />
  );
};
