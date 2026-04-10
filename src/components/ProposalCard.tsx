import { Link } from "react-router-dom";
import styled, { useTheme } from "styled-components";

import {
  Card,
  ParLg,
  ParMd,
  ParSm,
  Button,
  widthQuery,
  MemberCard,
  MemberCardExplorerLink,
  MemberCardCopyAddress,
} from "@/lib/ui";
import type { ProposalItem } from "@/lib/dao-hooks";
import type { ValidNetwork } from "@/lib/keychain-utils";
import {
  charLimit,
  formatShortDateTimeFromSeconds,
  PROPOSAL_TYPE_LABELS,
  getProposalTypeLabel,
} from "@/lib/utils";
import { ProposalActions } from "./ProposalActions/ProposalActions";

const CardContainer = styled(Card)`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  width: 100%;
  padding: 2.3rem 2.5rem;
  border: none;
  margin-bottom: 2rem;
  min-height: 23.8rem;

  @media ${widthQuery.sm} {
    flex-direction: column;
    gap: 2rem;
  }
`;

const LeftCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
`;

const RightCard = styled.div`
  width: 32rem;
  min-width: 32rem;

  @media ${widthQuery.sm} {
    width: 100%;
    min-width: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const DescriptionMd = styled(ParMd)`
  margin-bottom: auto;
  word-break: break-word;
`;

const SubmittedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: auto;
`;

const ViewDetailsLink = styled(Link)`
  text-decoration: none;
`;

type ProposalCardProps = {
  proposal: ProposalItem;
  daoChain: string;
  daoId: string;
};

export const ProposalCard = ({
  proposal,
  daoChain,
  daoId,
}: ProposalCardProps) => {
  const theme = useTheme();
  const typeLabel = getProposalTypeLabel(
    proposal.proposalType,
    PROPOSAL_TYPE_LABELS
  );
  const detailPath = `/molochv3/${daoChain}/${daoId}/proposal/${proposal.proposalId}`;

  return (
    <CardContainer>
      <LeftCard>
        <CardHeader>
          <MetaRow>
            <ParSm color={theme.secondary.step11}>
              {proposal.proposalId} | {typeLabel}
              {proposal.createdAt && (
                <> | {formatShortDateTimeFromSeconds(proposal.createdAt)}</>
              )}
            </ParSm>
          </MetaRow>
          <ViewDetailsLink to={detailPath}>
            <Button color="secondary" size="sm">
              View Details
            </Button>
          </ViewDetailsLink>
        </CardHeader>

        <ParLg>{proposal.title || "(No Title)"}</ParLg>

        {proposal.description && (
          <DescriptionMd color={theme.secondary.step11}>
            {charLimit(proposal.description, 145)}
          </DescriptionMd>
        )}

        <SubmittedRow>
          <ParMd color={theme.secondary.step11}>Submitted by</ParMd>
          <MemberCard variant="ghost" profile={{ address: proposal.createdBy }}>
            <MemberCardExplorerLink
              explorerNetworkId={daoChain as ValidNetwork}
              profileAddress={proposal.createdBy}
            >
              View on Etherscan
            </MemberCardExplorerLink>
            <MemberCardCopyAddress profileAddress={proposal.createdBy}>
              Copy Address
            </MemberCardCopyAddress>
          </MemberCard>
        </SubmittedRow>
      </LeftCard>

      <RightCard>
        <ProposalActions proposal={proposal} daoChain={daoChain} daoId={daoId} />
      </RightCard>
    </CardContainer>
  );
};
