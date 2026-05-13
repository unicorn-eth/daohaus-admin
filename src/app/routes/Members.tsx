import { Link } from "react-router-dom";
import styled from "styled-components";

import { Button } from "@/lib/ui";
import { useCurrentDao } from "@/app/hooks/useCurrentDao";
import { MemberList } from "@/features/member/components/MemberList";
import { Plus } from "lucide-react";

const ButtonLink = styled(Link)`
  text-decoration: none;
`;

export const Members = () => {
  const { daoChain, daoId } = useCurrentDao();

  return (
    <MemberList
      chainid={daoChain}
      daoid={daoId}
      allowLinks={true}
      rightActionEl={
        <ButtonLink
          to={`/molochv3/${daoChain}/${daoId}/new-proposal?formLego=ISSUE`}
        >
          <Button IconLeft={Plus}>New Member</Button>
        </ButtonLink>
      }
    />
  );
};
