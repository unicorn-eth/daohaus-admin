import styled from "styled-components";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { Button, ParSm } from "@/lib/ui";

const ConnectBoxContainer = styled.div`
  border-radius: ${({ theme }) => theme.card.radius};
  border: 1px solid ${({ theme }) => theme.danger.step9};
  padding: 1.5rem;
  margin-bottom: 2rem;

  .inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.6rem;
  }
`;

export const ConnectBox = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <ConnectBoxContainer>
      <div className="inner">
        <ParSm>Connect wallet to summon a DAO</ParSm>
        <Button size="sm" onClick={() => openConnectModal?.()}>
          Connect
        </Button>
      </div>
    </ConnectBoxContainer>
  );
};
