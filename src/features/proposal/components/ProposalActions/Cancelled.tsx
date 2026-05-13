import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate } from './ActionPrimitives';
import { VoteBar } from '../VoteBar';

export const Cancelled = ({ proposal }: { proposal: ProposalItem }) => {
  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay="Proposal Cancelled"
      main={<VoteBar proposal={proposal} />}
    />
  );
};
