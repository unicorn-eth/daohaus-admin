import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate, Verdict } from './ActionPrimitives';
import { VoteBar } from '@/components/VoteBar';

export const Expired = ({ proposal }: { proposal: ProposalItem }) => {
  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay="Proposal Expired"
      main={
        <>
          <VoteBar proposal={proposal} />
          <Verdict passed={false} />
        </>
      }
    />
  );
};
