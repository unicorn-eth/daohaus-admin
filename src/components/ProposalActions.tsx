import styled, { useTheme } from "styled-components";

import { Card, H5, ParSm, widthQuery } from "@/lib/ui";
import type { ProposalItem } from "@/lib/dao-hooks";
import type { ProposalStatus } from "@/lib/utils";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { VoteBar } from "./VoteBar";
import { VoteList } from "./VoteList";

const ActionsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 45.7rem;
  padding: 2rem;
  border: none;
  margin-bottom: 3.4rem;
  height: fit-content;

  @media ${widthQuery.md} {
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }
`;

/** Compact version used inside ProposalCard list items (no card wrapper, no vote list) */
const ActionsInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  height: 100%;
`;

const VoteCounts = styled.div`
  display: flex;
  gap: 2rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.secondary.step5};
`;

type ProposalActionsProps = {
  proposal: ProposalItem;
  status: ProposalStatus;
  /** When true renders as a standalone card (detail page). Default: false (list card). */
  detailed?: boolean;
};

export const ProposalActions = ({
  proposal,
  status,
  detailed = false,
}: ProposalActionsProps) => {
  const theme = useTheme();

  const inner = (
    <ActionsInner>
      <ProposalStatusBadge status={status} />
      <VoteBar proposal={proposal} />
      <VoteCounts>
        <ParSm color={theme.secondary.step11}>Yes: {proposal.yesVotes}</ParSm>
        <ParSm color={theme.secondary.step11}>No: {proposal.noVotes}</ParSm>
      </VoteCounts>

      {detailed && (
        <>
          <Divider />
          <H5>Votes</H5>
          <VoteList proposal={proposal} />
        </>
      )}
    </ActionsInner>
  );

  if (detailed) {
    return <ActionsCard>{inner}</ActionsCard>;
  }

  return inner;
};
