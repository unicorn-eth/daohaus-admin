import styled from 'styled-components';

import { ParMd, widthQuery } from '@/lib/ui';
import { PROPOSAL_STATUS, getProposalStatus } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate } from './ActionPrimitives';
import { VotingPeriod } from './VotingPeriod';
import { Unsponsored } from './Unsponsored';
import { ReadyForProcessing } from './ReadyForProcessing';

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
        <ActionTemplate proposal={proposal} statusDisplay="Cancelled" />
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
        <ActionTemplate proposal={proposal} statusDisplay="In Grace Period" />
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
        <ActionTemplate proposal={proposal} statusDisplay="Passed" />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.failed) {
    return (
      <ActionBox>
        <ActionTemplate proposal={proposal} statusDisplay="Failed" />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.actionFailed) {
    return (
      <ActionBox>
        <ActionTemplate proposal={proposal} statusDisplay="Execution Failed" />
      </ActionBox>
    );
  }

  if (status === PROPOSAL_STATUS.expired) {
    return (
      <ActionBox>
        <ActionTemplate proposal={proposal} statusDisplay="Expired" />
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
