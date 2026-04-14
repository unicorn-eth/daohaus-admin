import styled from 'styled-components';

import { ParMd, widthQuery } from '@/lib/ui';
import { PROPOSAL_STATUS, getProposalStatus } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate } from './ActionPrimitives';
import { ActionFailed } from './ActionFailed';
import { Cancelled } from './Cancelled';
import { Expired } from './Expired';
import { Failed } from './Failed';
import { GracePeriod } from './GracePeriod';
import { Passed } from './Passed';
import { ReadyForProcessing } from './ReadyForProcessing';
import { Unsponsored } from './Unsponsored';
import { VotingPeriod } from './VotingPeriod';

const ActionBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 19.2rem;
  width: 100%;
  @media ${widthQuery.sm} {
    min-height: 0;
  }
`;

export const ProposalActions = ({
  proposal,
  daoChain,
  daoId,
}: {
  proposal: ProposalItem;
  daoChain: string;
  daoId: string;
}) => {
  const status = getProposalStatus(proposal);

  if (status === PROPOSAL_STATUS.cancelled) {
    return (
      <ActionBox>
        <Cancelled proposal={proposal} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.unsponsored) {
    return (
      <ActionBox>
        <Unsponsored proposal={proposal} daoChain={daoChain} daoId={daoId} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.voting) {
    return (
      <ActionBox>
        <VotingPeriod proposal={proposal} daoChain={daoChain} daoId={daoId} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.grace) {
    return (
      <ActionBox>
        <GracePeriod proposal={proposal} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.needsProcessing) {
    return (
      <ActionBox>
        <ReadyForProcessing proposal={proposal} daoChain={daoChain} daoId={daoId} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.passed) {
    return (
      <ActionBox>
        <Passed proposal={proposal} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.failed) {
    return (
      <ActionBox>
        <Failed proposal={proposal} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.actionFailed) {
    return (
      <ActionBox>
        <ActionFailed proposal={proposal} daoChain={daoChain} />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.expired) {
    return (
      <ActionBox>
        <Expired proposal={proposal} />
      </ActionBox>
    );
  }

  return (
    <ActionBox>
      <ActionTemplate
        proposal={proposal}
        statusDisplay="Status Pending"
        main={<ParMd>{status} Proposal Status</ParMd>}
      />
    </ActionBox>
  );
};
