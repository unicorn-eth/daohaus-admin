import styled from "styled-components";
import { indigoDark } from "@radix-ui/colors";

import {
  H4,
  DataXs,
  AddressDisplay,
  ProfileAvatar,
  widthQuery,
} from "@/lib/ui";
import type { MemberItem } from "@/lib/dao-hooks";
import type { ValidNetwork } from "@/lib/keychain-utils";
import { formatLongDateFromSeconds } from "@/lib/utils";
import { useProfile } from "@/app/hooks/useProfile";
import { MemberMenu } from "./MemberMenu";
import { useAccount } from "wagmi";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: ${indigoDark.indigo5};
  padding: 2.8rem;
  border-radius: 0.8rem;
  margin-bottom: 3rem;
  width: 100%;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  @media ${widthQuery.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

type MemberProfileProps = {
  member: MemberItem;
  daoChain: string;
  daoId: string;
};

export const MemberProfile = ({
  member,
  daoChain,
  daoId,
}: MemberProfileProps) => {
  const { address: connectedAddress } = useAccount();
  const profile = useProfile(member.memberAddress);

  return (
    <Container>
      <TopRow>
        <Identity>
          <ProfileAvatar
            address={member.memberAddress}
            image={profile.avatar}
            size="4xl"
          />
          <NameBlock>
            {profile.ens && <H4>{profile.ens}</H4>}
            <AddressDisplay
              address={member.memberAddress}
              explorerNetworkId={daoChain as ValidNetwork}
              truncate
              copy
            />
            <DataXs>
              Joined {formatLongDateFromSeconds(member.createdAt)}
            </DataXs>
          </NameBlock>
        </Identity>

        <MemberMenu
          member={member}
          daoChain={daoChain}
          daoId={daoId}
          connectedAddress={connectedAddress}
        />
      </TopRow>
    </Container>
  );
};
