import { ParMd, TintSecondary } from '@/lib/ui';
import { formatShares } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate, VotingResults } from './ActionPrimitives';
import { VoteBar } from '@/components/VoteBar';

export const HasVoted = ({
  proposal,
  approved,
  userVoteBalance,
  readableTime,
}: {
  proposal: ProposalItem;
  approved?: boolean;
  userVoteBalance?: string;
  readableTime?: string;
}) => {
  const voterHelperText = `You voted ${approved ? 'Yes' : 'No'} (${formatShares(
    userVoteBalance || '0'
  )})`;

  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay={
        <ParMd>
          Voting ends in <TintSecondary>{readableTime}</TintSecondary>
        </ParMd>
      }
      main={
        <>
          <VoteBar proposal={proposal} />
          <VotingResults proposal={proposal} isVoting={true} />
        </>
      }
      helperDisplay={voterHelperText}
    />
  );
};
