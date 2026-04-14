import styled from "styled-components";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

import {
  Bold,
  Button,
  Card,
  DataIndicator,
  DataMd,
  Dialog,
  DialogContent,
  DialogTrigger,
  Link,
  MemberCard,
  MemberCardCopyAddress,
  MemberCardExplorerLink,
  ParLg,
  ParMd,
  widthQuery,
} from "@/lib/ui";
import type { ProposalItem } from "@/lib/dao-hooks";
import type { ValidNetwork } from "@/lib/keychain-utils";
import { generateExplorerLink, getNetwork } from "@/lib/keychain-utils";
import {
  buildProposalHistory,
  formatShortDateTimeFromSeconds,
  formatValueTo,
  fromWei,
  getProposalStatus,
  type ProposalHistoryElement,
  type ProposalHistoryElementData,
} from "@/lib/utils";

// ── Styles ──────────────────────────────────────────────────────────────────

const HistoryListContainer = styled(Card)`
  width: 45.7rem;
  border: none;
  @media ${widthQuery.md} {
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }
`;

const ElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 2rem 0;
  border-bottom: 1px solid #ffffff16;
`;

const VisibleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
`;

const StyledTitle = styled(Bold)<{ $active: boolean }>`
  color: ${({ theme, $active }) => $active && theme.primary.step10};
`;

const ExpandedDataGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 2.4rem;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 2.5rem;
`;

const VotesButton = styled(Button)`
  min-width: 10.6rem;
`;

const VotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 3rem;
  min-width: 50rem;
  max-height: 50rem;
  @media ${widthQuery.sm} {
    min-width: 100%;
  }
  overflow: auto;
  padding-right: 1rem;
`;

const VoteRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 3rem 0;
  @media ${widthQuery.sm} {
    margin: 1.2rem 0;
  }
`;

const IconButton = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.primary.step10};
  display: flex;
  align-items: center;
`;

// ── DataPoint ────────────────────────────────────────────────────────────────

const DataPoint = ({
  data,
  daoChain,
}: {
  data: ProposalHistoryElementData;
  daoChain?: string;
}) => {
  if (data.dataType === "member") {
    return (
      <div>
        <ParMd>{data.label}</ParMd>
        <MemberCard variant="ghost" profile={{ address: data.data }}>
          <MemberCardExplorerLink
            explorerNetworkId={daoChain as ValidNetwork}
            profileAddress={data.data}
          >
            View on Etherscan
          </MemberCardExplorerLink>
          <MemberCardCopyAddress profileAddress={data.data}>
            Copy Address
          </MemberCardCopyAddress>
        </MemberCard>
      </div>
    );
  }

  if (data.dataType === "dataIndicator") {
    return <DataIndicator label={data.label} data={data.data} />;
  }

  return null;
};

// ── VoteList ─────────────────────────────────────────────────────────────────

const VoteList = ({
  proposal,
  daoChain,
}: {
  proposal: ProposalItem;
  daoChain: string;
}) => {
  const totalYes = formatValueTo({
    value: Number(fromWei(proposal.yesBalance)),
    decimals: 2,
    format: "numberShort",
  });
  const totalNo = formatValueTo({
    value: Number(fromWei(proposal.noBalance)),
    decimals: 2,
    format: "numberShort",
  });

  return (
    <div>
      <VotesContainer>
        {proposal.votes?.map((vote) => (
          <div key={vote.id}>
            <ParMd>{formatShortDateTimeFromSeconds(vote.createdAt)}</ParMd>
            <VoteRow>
              <MemberCard
                variant="ghost"
                profile={{ address: vote.member.memberAddress }}
              >
                <MemberCardExplorerLink
                  explorerNetworkId={daoChain as ValidNetwork}
                  profileAddress={vote.member.memberAddress}
                >
                  View on Etherscan
                </MemberCardExplorerLink>
                <MemberCardCopyAddress
                  profileAddress={vote.member.memberAddress}
                >
                  Copy Address
                </MemberCardCopyAddress>
              </MemberCard>
              <DataMd>
                {vote.approved ? "Yes" : "No"} —{" "}
                {formatValueTo({
                  value: Number(fromWei(vote.balance)),
                  decimals: 2,
                  format: "numberShort",
                })}
              </DataMd>
            </VoteRow>
          </div>
        ))}
      </VotesContainer>

      <VoteRow>
        <ParMd>Total</ParMd>
        <DataMd>
          {totalYes} Yes / {totalNo} No
        </DataMd>
      </VoteRow>
    </div>
  );
};

// ── ProposalHistoryCard ───────────────────────────────────────────────────────

const ProposalHistoryCard = ({
  element,
  proposal,
  daoChain,
}: {
  element: ProposalHistoryElement;
  proposal: ProposalItem;
  daoChain: string;
}) => {
  const [open, setOpen] = useState(false);

  const hasProposalVotes = proposal.votes && proposal.votes.length > 0;

  const totalVotes = hasProposalVotes
    ? formatValueTo({
        value:
          Number(fromWei(proposal.yesBalance)) +
          Number(fromWei(proposal.noBalance)),
        decimals: 0,
        format: "numberShort",
        separator: "",
      })
    : "0";

  const explorerLink =
    element.txHash && daoChain
      ? generateExplorerLink({
          chainId: daoChain as ValidNetwork,
          address: element.txHash,
          type: "tx",
        })
      : undefined;

  return (
    <ElementContainer>
      <VisibleContainer>
        <ContentContainer>
          <ParLg>
            <StyledTitle $active={element.active}>{element.title}</StyledTitle>
          </ParLg>
          {element.text && <ParMd>{element.text}</ParMd>}
        </ContentContainer>

        {element.canExpand && (
          <IconButton onClick={() => setOpen((p) => !p)}>
            {open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </IconButton>
        )}

        {element.showVotesButton && hasProposalVotes && (
          <Dialog>
            <DialogTrigger asChild>
              <VotesButton color="secondary" size="sm">
                Show Votes
              </VotesButton>
            </DialogTrigger>
            <DialogContent
              alignButtons="end"
              rightButton={{ $closeDialog: true }}
              title={`Proposal Votes (${totalVotes})`}
            >
              <VoteList proposal={proposal} daoChain={daoChain} />
            </DialogContent>
          </Dialog>
        )}
      </VisibleContainer>

      {element.canExpand && open && (
        <>
          <ExpandedDataGrid>
            {element.dataElements?.map((data) => (
              <DataPoint data={data} daoChain={daoChain} key={data.label} />
            ))}
          </ExpandedDataGrid>

          {explorerLink && (
            <LinkContainer>
              <Link
                href={explorerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Transaction
              </Link>
            </LinkContainer>
          )}
        </>
      )}
    </ElementContainer>
  );
};

// ── ProposalHistory ───────────────────────────────────────────────────────────

type ProposalHistoryProps = {
  proposal: ProposalItem;
  daoChain: string;
};

export const ProposalHistory = ({
  proposal,
  daoChain,
}: ProposalHistoryProps) => {
  const status = getProposalStatus(proposal);
  const networkData = getNetwork(daoChain);

  const historyData = useMemo(
    () => buildProposalHistory({ proposal, status, networkData }),
    [proposal, status, networkData],
  );

  if (!historyData) return null;

  return (
    <HistoryListContainer>
      {historyData.map((element) => (
        <ProposalHistoryCard
          key={element.title}
          element={element}
          proposal={proposal}
          daoChain={daoChain}
        />
      ))}
    </HistoryListContainer>
  );
};
