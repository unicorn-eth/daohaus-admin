import styled, { useTheme } from "styled-components";

import {
  Card,
  ParMd,
  DataIndicator,
  MemberCard,
  MemberCardExplorerLink,
  MemberCardCopyAddress,
  widthQuery,
} from "@/lib/ui";
import type { ProposalItem } from "@/lib/dao-hooks";
import type { ValidNetwork } from "@/lib/keychain-utils";
import { formatShortDateTimeFromSeconds } from "@/lib/utils";
import { ProposalTimeline } from "./ProposalTimeline";

const DetailCard = styled(Card)`
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

const Description = styled.div`
  font-size: 1.6rem;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.secondary.step12};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmittedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.secondary.step5};
`;

type ProposalDetailCardProps = {
  proposal: ProposalItem;
  daoChain: string;
  daoId: string;
};

export const ProposalDetailCard = ({
  proposal,
  daoChain,
  daoId: _daoId,
}: ProposalDetailCardProps) => {
  const theme = useTheme();

  return (
    <DetailCard>
      {proposal.description && (
        <Description>{proposal.description}</Description>
      )}

      {proposal.contentURI && (
        <a
          href={proposal.contentURI}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.primary.step9, wordBreak: "break-all" }}
        >
          {proposal.contentURI}
        </a>
      )}

      <Divider />

      <Section>
        <SubmittedRow>
          <ParMd color={theme.secondary.step11}>Submitted by</ParMd>
          <MemberCard
            variant="ghost"
            profile={{ address: proposal.createdBy }}
          >
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

        {proposal.proposedBy && proposal.proposedBy !== proposal.createdBy && (
          <SubmittedRow>
            <ParMd color={theme.secondary.step11}>Through Contract</ParMd>
            <MemberCard
              variant="ghost"
              profile={{ address: proposal.proposedBy }}
            >
              <MemberCardExplorerLink
                explorerNetworkId={daoChain as ValidNetwork}
                profileAddress={proposal.proposedBy}
              >
                View on Etherscan
              </MemberCardExplorerLink>
              <MemberCardCopyAddress profileAddress={proposal.proposedBy}>
                Copy Address
              </MemberCardCopyAddress>
            </MemberCard>
          </SubmittedRow>
        )}

        <DataIndicator
          label="Submitted"
          data={formatShortDateTimeFromSeconds(proposal.createdAt) ?? "—"}
          size="sm"
        />
      </Section>

      <Divider />

      <ProposalTimeline proposal={proposal} />
    </DetailCard>
  );
};
