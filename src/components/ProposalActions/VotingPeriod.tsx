import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { baalTimeToNow } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { HasVoted } from './HasVoted';
import { HasNotVoted } from './HasNotVoted';

export const VotingPeriod = ({
  proposal,
  daoChain,
  daoId,
}: {
  proposal: ProposalItem;
  daoChain: string;
  daoId: string;
}) => {
  const { address } = useAccount();

  const readableTime = useMemo(
    () => baalTimeToNow(proposal.votingEnds),
    [proposal.votingEnds]
  );

  const userVoteData = useMemo(() => {
    if (!address || !proposal.votes) return undefined;
    return proposal.votes.find(
      (v) =>
        v.member?.memberAddress?.toLowerCase() === address.toLowerCase()
    );
  }, [address, proposal.votes]);

  if (userVoteData) {
    return (
      <HasVoted
        proposal={proposal}
        approved={userVoteData.approved}
        readableTime={readableTime}
        userVoteBalance={userVoteData.balance}
      />
    );
  }

  return (
    <HasNotVoted
      proposal={proposal}
      daoChain={daoChain}
      daoId={daoId}
      readableTime={readableTime}
    />
  );
};
