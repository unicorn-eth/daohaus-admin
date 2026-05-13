import styled from "styled-components";
import { Link } from "react-router-dom";
import { indigoDark } from "@radix-ui/colors";
import { CheckCircle, XCircle } from "lucide-react";

import {
  Card,
  DataIndicator,
  H5,
  ParMd,
  ParSm,
  MemberCard,
  MemberCardExplorerLink,
  MemberCardCopyAddress,
  widthQuery,
} from "@/lib/ui";
import type { MemberItem } from "@/lib/dao-hooks";
import type { ValidNetwork } from "@/lib/keychain-utils";
import {
  formatValueTo,
  fromWei,
  formatShortDateTimeFromSeconds,
  truncateAddress,
} from "@/lib/utils";

const StatsCard = styled(Card)`
  border: none;
  padding: 2.8rem;
  margin-bottom: 3rem;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  width: 100%;
  margin-bottom: 3rem;

  > div {
    padding: 1.6rem 0;
    width: 18rem;

    @media ${widthQuery.sm} {
      min-width: 100%;
    }
  }
`;

const Section = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled(H5)`
  margin-bottom: 1.6rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid ${indigoDark.indigo5};
`;

const DelegateLabel = styled(ParMd)`
  margin-bottom: 0.8rem;
  opacity: 0.8;
`;

const VoteTable = styled.table`
  width: 100%;
  font-size: 1.4rem;
  border-collapse: collapse;
`;

const Th = styled.th`
  color: ${indigoDark.indigo11};
  border-bottom: 1px solid ${indigoDark.indigo5};
  padding: 0.6rem 1rem 0.6rem 0;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem 1rem 1rem 0;
  vertical-align: middle;
`;

const VoteIcon = styled.span<{ $approved: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ $approved }) => ($approved ? "#4ade80" : "#f87171")};
`;

const TxLink = styled(Link)`
  font-size: 1.2rem;
  color: ${indigoDark.indigo10};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

type MemberStatsProps = {
  member: MemberItem;
  totalShares: string;
  daoChain: string;
  daoId: string;
};

function votingPowerPct(delegateShares: string, totalShares: string): string {
  if (!totalShares || totalShares === "0") return "0.00%";
  const pct =
    (Number(fromWei(delegateShares)) / Number(fromWei(totalShares))) * 100;
  return `${pct.toFixed(2)}%`;
}

function explorerTxUrl(chainId: string, txHash: string): string {
  const explorers: Record<string, string> = {
    "0x1": "https://etherscan.io",
    "0x89": "https://polygonscan.com",
    "0xa": "https://optimistic.etherscan.io",
    "0xa4b1": "https://arbiscan.io",
    "0x64": "https://gnosisscan.io",
    "0x2105": "https://basescan.org",
    "0xa86a": "https://snowtrace.io",
  };
  const base = explorers[chainId] ?? "https://etherscan.io";
  return `${base}/tx/${txHash}`;
}

export const MemberStats = ({
  member,
  totalShares,
  daoChain,
}: MemberStatsProps) => {
  const isDelegatingToSelf =
    member.delegatingTo.toLowerCase() === member.memberAddress.toLowerCase();

  // votes field may be a single object or array depending on subgraph version
  const votes = Array.isArray(member.votes)
    ? member.votes
    : member.votes
      ? [member.votes]
      : [];

  return (
    <StatsCard>
      <StatsGrid>
        <DataIndicator
          label="Voting Power"
          data={votingPowerPct(member.delegateShares, totalShares)}
        />
        <DataIndicator
          label="Voting Tokens"
          data={formatValueTo({
            value: fromWei(member.shares),
            decimals: 2,
            format: "number",
          })}
        />
        <DataIndicator
          label="Non-Voting Tokens"
          data={formatValueTo({
            value: fromWei(member.loot),
            decimals: 2,
            format: "number",
          })}
        />
        <DataIndicator
          label="Delegated From"
          data={member.delegateOfCount ?? "0"}
        />
      </StatsGrid>

      {!isDelegatingToSelf && (
        <Section>
          <DelegateLabel>Delegating To</DelegateLabel>
          <MemberCard
            variant="ghost"
            profile={{ address: member.delegatingTo }}
          >
            <MemberCardExplorerLink
              explorerNetworkId={daoChain as ValidNetwork}
              profileAddress={member.delegatingTo}
            >
              View on Etherscan
            </MemberCardExplorerLink>
            <MemberCardCopyAddress profileAddress={member.delegatingTo}>
              Copy Address
            </MemberCardCopyAddress>
          </MemberCard>
        </Section>
      )}

      {votes.length > 0 && (
        <Section>
          <SectionTitle>Vote History</SectionTitle>
          <VoteTable>
            <thead>
              <tr>
                <Th>Vote</Th>
                <Th>Balance</Th>
                <Th>Date</Th>
                <Th>Tx</Th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote) => (
                <tr key={vote.txHash}>
                  <Td>
                    <VoteIcon $approved={vote.approved}>
                      {vote.approved ? (
                        <>
                          <CheckCircle size={14} /> Yes
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> No
                        </>
                      )}
                    </VoteIcon>
                  </Td>
                  <Td>
                    <ParSm>
                      {formatValueTo({
                        value: fromWei(vote.balance),
                        decimals: 2,
                        format: "number",
                      })}
                    </ParSm>
                  </Td>
                  <Td>
                    <ParSm>
                      {formatShortDateTimeFromSeconds(vote.createdAt)}
                    </ParSm>
                  </Td>
                  <Td>
                    <TxLink
                      to={explorerTxUrl(daoChain, vote.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {truncateAddress(vote.txHash)}
                    </TxLink>
                  </Td>
                </tr>
              ))}
            </tbody>
          </VoteTable>
        </Section>
      )}

      {votes.length === 0 && (
        <Section>
          <ParMd>No vote history found.</ParMd>
        </Section>
      )}
    </StatsCard>
  );
};
