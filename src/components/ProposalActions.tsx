import styled, { useTheme } from "styled-components";

import { ParSm } from "@/lib/ui";
import type { ProposalItem } from "@/lib/dao-hooks";
import type { ProposalStatus } from "@/lib/utils";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { VoteBar } from "./VoteBar";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  height: 100%;
`;

const VoteCounts = styled.div`
  display: flex;
  gap: 2rem;
`;

type ProposalActionsProps = {
  proposal: ProposalItem;
  status: ProposalStatus;
};

export const ProposalActions = ({ proposal, status }: ProposalActionsProps) => {
  const theme = useTheme();

  return (
    <ActionsContainer>
      <ProposalStatusBadge status={status} />
      <VoteBar proposal={proposal} />
      <VoteCounts>
        <ParSm color={theme.secondary.step11}>Yes: {proposal.yesVotes}</ParSm>
        <ParSm color={theme.secondary.step11}>No: {proposal.noVotes}</ParSm>
      </VoteCounts>
    </ActionsContainer>
  );
};
