import { useState } from "react";
import styled from "styled-components";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Bold, ParMd, DataSm, Card, widthQuery } from "@/lib/ui";
import type { ProposalItem } from "@/lib/dao-hooks";
import { getProposalTypeLabel, PROPOSAL_TYPE_LABELS } from "@/lib/utils";

const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 64rem;
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

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconButton = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.primary.step10};
  display: flex;
  align-items: center;
`;

const HexBlock = styled(DataSm)`
  word-break: break-all;
  background: ${({ theme }) => theme.secondary.step2};
  padding: 1rem;
  border-radius: 0.4rem;
  margin-top: 0.8rem;
`;

const Row = styled.div`
  margin-bottom: 1rem;
`;

type ProposalActionDataProps = {
  proposal: ProposalItem;
};

export const ProposalActionData = ({ proposal }: ProposalActionDataProps) => {
  const [open, setOpen] = useState(false);
  const typeLabel = getProposalTypeLabel(
    proposal.proposalType,
    PROPOSAL_TYPE_LABELS,
  );

  const hasData =
    proposal.proposalData &&
    proposal.proposalData !== "0x" &&
    proposal.proposalData !== "0x0";

  return (
    <Container>
      <TitleRow>
        <ParMd>
          <Bold>Transaction Data</Bold>
        </ParMd>
        {hasData && (
          <IconButton onClick={() => setOpen((p) => !p)}>
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </IconButton>
        )}
      </TitleRow>

      <Row>
        <DataSm>
          <Bold>TYPE: </Bold>
          {typeLabel}
        </DataSm>
      </Row>

      {hasData && open && (
        <Row>
          <DataSm>
            <Bold>CALLDATA</Bold>
          </DataSm>
          <HexBlock>{proposal.proposalData}</HexBlock>
        </Row>
      )}

      {!hasData && <DataSm>No on-chain calldata for this proposal.</DataSm>}
    </Container>
  );
};
