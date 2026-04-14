import { Link } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft, Share2 } from "lucide-react";

import {
  SingleColumnLayout,
  Loading,
  ParMd,
  Button,
  Card,
  widthQuery,
} from "@/lib/ui";
import { useMember, useDao } from "@/lib/dao-hooks";
import { useCurrentDao } from "@/app/hooks/useCurrentDao";
import { useCopyToClipboard } from "@/lib/ui";
import { MemberProfile } from "@/features/member/components/MemberProfile";
import { MemberStats } from "@/features/member/components/MemberStats";
import { MemberTokens } from "@/features/member/components/MemberTokens";
import { useParams } from "react-router-dom";

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;

  @media ${widthQuery.sm} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const BackLink = styled(Link)`
  text-decoration: none;
`;

const AlertCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  padding: 3rem;
  min-height: 16rem;
`;

export const Member = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { memberAddress } = useParams<{ memberAddress: string }>();
  const copy = useCopyToClipboard();

  const { member, isLoading } = useMember({
    chainid: daoChain,
    daoid: daoId,
    memberaddress: memberAddress,
  });

  const { dao } = useDao({ chainid: daoChain, daoid: daoId });

  const handleShareProfile = () => {
    copy(window.location.href, "Profile URL copied!");
  };

  return (
    <SingleColumnLayout title="Member Profile">
      <TopBar>
        <BackLink to={`/molochv3/${daoChain}/${daoId}/members`}>
          <Button color="secondary" variant="outline" IconLeft={ArrowLeft}>
            Members
          </Button>
        </BackLink>
        <Button
          color="secondary"
          variant="outline"
          IconLeft={Share2}
          onClick={handleShareProfile}
        >
          Share Profile
        </Button>
      </TopBar>

      {isLoading && <Loading size={80} />}

      {!isLoading && !member && (
        <AlertCard>
          <ParMd>Member not found.</ParMd>
        </AlertCard>
      )}

      {member && (
        <>
          <MemberProfile member={member} daoChain={daoChain} daoId={daoId} />
          {dao && (
            <MemberTokens member={member} dao={dao} daoChain={daoChain} />
          )}
          <MemberStats
            member={member}
            totalShares={dao?.totalShares ?? "0"}
            daoChain={daoChain}
            daoId={daoId}
          />
        </>
      )}
    </SingleColumnLayout>
  );
};
