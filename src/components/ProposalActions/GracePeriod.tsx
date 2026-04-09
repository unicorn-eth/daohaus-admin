import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { ParMd, TintSecondary } from '@/lib/ui';
import { baalTimeToNow, formatShares } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate, VotingResults } from './ActionPrimitives';
import { VoteBar } from '@/components/VoteBar';

export const GracePeriod = ({ proposal }: { proposal: ProposalItem }) => {
  const { address } = useAccount();

  const userVoteData = useMemo(() => {
    if (!address || !proposal.votes) return undefined;
    return proposal.votes.find(
      (v) => v.member?.memberAddress?.toLowerCase() === address.toLowerCase()
    );
  }, [address, proposal.votes]);

  const readableTime = useMemo(
    () => baalTimeToNow(proposal.graceEnds),
    [proposal.graceEnds]
  );

  const userVoteDisplay =
    userVoteData &&
    `You voted ${userVoteData.approved ? 'Yes' : 'No'} (${formatShares(userVoteData.balance)})`;

  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay={
        <ParMd>
          Grace ends in <TintSecondary>{readableTime}</TintSecondary>
        </ParMd>
      }
      main={
        <>
          <VoteBar proposal={proposal} />
          <VotingResults proposal={proposal} isVoting={false} />
        </>
      }
      helperDisplay={userVoteDisplay}
    />
  );
};
