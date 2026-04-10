import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { checkHasQuorum, formatShares, roundedPercentage } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate, Verdict } from './ActionPrimitives';
import { VoteBar } from '@/components/VoteBar';

const getFailReason = ({
  proposal,
  userApproved,
  userVotePower,
}: {
  proposal: ProposalItem;
  userApproved?: boolean;
  userVotePower?: string;
}): string | undefined => {
  if (
    !checkHasQuorum({
      yesVotes: Number(proposal.yesBalance),
      quorumPercent: Number(proposal.dao.quorumPercent),
      totalShares: Number(proposal.dao.totalShares),
    })
  ) {
    return 'Quorum not met';
  }
  if (userVotePower) {
    return `You voted ${userApproved ? 'Yes' : 'No'} (${formatShares(userVotePower)})`;
  }
  return undefined;
};

export const Failed = ({ proposal }: { proposal: ProposalItem }) => {
  const { address } = useAccount();

  const percentNo = roundedPercentage(
    Number(proposal.noBalance),
    Number(proposal.dao.totalShares)
  );

  const userVoteData = useMemo(() => {
    if (!address || !proposal.votes) return undefined;
    return proposal.votes.find(
      (v) => v.member?.memberAddress?.toLowerCase() === address.toLowerCase()
    );
  }, [address, proposal.votes]);

  const failDisplay = useMemo(
    () =>
      getFailReason({
        proposal,
        userApproved: userVoteData?.approved,
        userVotePower: userVoteData?.balance,
      }),
    [proposal, userVoteData]
  );

  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay="Proposal Failed"
      main={
        <>
          <VoteBar proposal={proposal} />
          <Verdict passed={false} appendText={` - ${percentNo}% No`} />
        </>
      }
      helperDisplay={failDisplay}
    />
  );
};
