import { Link } from "react-router-dom";
import styled from "styled-components";
import { ProfileAvatar, Tag, ParLg, ParMd, Bold } from "@/lib/ui";
import type { DaoItem, MemberItem } from "@/lib/dao-hooks";
import { getHexNetworkName } from "@/lib/keychain-utils";

type DaoWithMember = DaoItem & { members: MemberItem[] };

type DaoCardProps = {
  dao: DaoWithMember;
  hexChainId: string;
};

const GoLink = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.8rem 1.6rem;
  text-align: center;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.button.radius};
  background-color: ${({ theme }) => theme.secondary.step6};
  color: ${({ theme }) => theme.secondary.step12};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.med};
  border: 1px solid ${({ theme }) => theme.secondary.step7};
  transition: background-color 0.15s ease;
  &:hover {
    background-color: ${({ theme }) => theme.secondary.step7};
  }
`;

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.secondary.step2};
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 34rem;
  min-width: 26rem;
  border: 1px solid ${({ theme }) => theme.secondary.step5};
  padding: 2.4rem;
  border-radius: ${({ theme }) => theme.card.radius};

  .top-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.2rem;
  }
  .stats-box {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 2.4rem;
  }
  .tag-box {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2.4rem;
  }
`;

function computeVotingPower(shares: string, totalShares: string): string {
  if (!totalShares || totalShares === "0") return "0%";
  const pct = (Number(shares) / Number(totalShares)) * 100;
  return `${pct.toFixed(2)}%`;
}

export const DaoCard = ({ dao, hexChainId }: DaoCardProps) => {
  const member = dao.members?.[0];
  const isDelegate = member && Number(member.delegateOfCount) > 0;

  const displayName = dao.name || dao.id;
  const truncName =
    displayName.length > 21 ? displayName.slice(0, 21) + "…" : displayName;

  return (
    <StyledCard>
      <div className="top-box">
        <ProfileAvatar
          address={dao.id}
          image={dao.profile?.avatarImg}
          size="xl"
        />
        {isDelegate && <Tag tagColor="yellow">Delegate</Tag>}
      </div>
      <ParLg style={{ marginBottom: "1.2rem" }}>{truncName}</ParLg>
      <div className="stats-box">
        <ParMd>
          <Bold>{dao.activeMemberCount ?? "—"}</Bold>{" "}
          {Number(dao.activeMemberCount) === 1 ? "Member" : "Members"}
        </ParMd>
        <ParMd>
          <Bold>{dao.proposalCount ?? "—"}</Bold>{" "}
          {Number(dao.proposalCount) === 1 ? "Proposal" : "Proposals"}
        </ParMd>
        {member ? (
          <ParMd>
            <Bold>{computeVotingPower(member.shares, dao.totalShares)}</Bold>{" "}
            Voting Power
          </ParMd>
        ) : (
          <ParMd>No Voting Power</ParMd>
        )}
      </div>
      <div className="tag-box">
        <Tag tagColor="red">{getHexNetworkName(hexChainId)}</Tag>
        <Tag tagColor="blue">Moloch v3</Tag>
      </div>
      <GoLink to={`/molochv3/${hexChainId}/${dao.id}`}>Go</GoLink>
    </StyledCard>
  );
};
