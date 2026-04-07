import styled, { useTheme } from "styled-components";

import { DataMd, ParMd, ParSm } from "@/lib/ui";
import type { ProposalItem, VoteItem } from "@/lib/dao-hooks";
import {
  formatShortDateTimeFromSeconds,
  formatValueTo,
  fromWei,
  truncateAddress,
} from "@/lib/utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const VoteRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.secondary.step5};
  margin: 0.4rem 0;
`;

const TotalRow = styled(VoteRow)`
  margin-top: 0.4rem;
`;

type VoteListProps = {
  proposal: ProposalItem;
};

const formatBalance = (balance: string) =>
  formatValueTo({ value: fromWei(balance), decimals: 2, format: "numberShort" });

const VoteEntry = ({ vote }: { vote: VoteItem }) => {
  const theme = useTheme();
  return (
    <div>
      <ParSm color={theme.secondary.step9}>
        {formatShortDateTimeFromSeconds(vote.createdAt)}
      </ParSm>
      <VoteRow>
        <ParMd>{truncateAddress(vote.member.memberAddress)}</ParMd>
        <DataMd>
          {vote.approved ? "Yes" : "No"} — {formatBalance(vote.balance)}
        </DataMd>
      </VoteRow>
    </div>
  );
};

export const VoteList = ({ proposal }: VoteListProps) => {
  const theme = useTheme();
  const votes = proposal.votes ?? [];

  if (votes.length === 0) {
    return <ParSm color={theme.secondary.step9}>No votes yet.</ParSm>;
  }

  return (
    <Container>
      {votes.map((vote) => (
        <VoteEntry key={vote.id} vote={vote} />
      ))}
      <Divider />
      <TotalRow>
        <ParMd>Total</ParMd>
        <DataMd>
          {formatBalance(proposal.yesBalance)} Yes /{" "}
          {formatBalance(proposal.noBalance)} No
        </DataMd>
      </TotalRow>
    </Container>
  );
};
