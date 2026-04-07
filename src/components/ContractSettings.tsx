import styled from "styled-components";

import { H3, ParSm, AddressDisplay, widthQuery } from "@/lib/ui";
import type { ValidNetwork } from "@/lib/keychain-utils";
import type { DaoItem } from "@/lib/dao-hooks";

// ── Styles ──────────────────────────────────────────────────────────────────

const SettingsSection = styled.div`
  width: 100%;
  padding: 3rem;
  background-color: ${({ theme }) => theme.secondary.step3};
  border-radius: 0.8rem;
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const AddressGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const AddressRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

// ── Component ────────────────────────────────────────────────────────────────

type ContractSettingsProps = {
  dao: DaoItem;
  daoChain: string;
};

export const ContractSettings = ({ dao, daoChain }: ContractSettingsProps) => {
  return (
    <SettingsSection>
      <SectionHeader>
        <H3>Contracts</H3>
      </SectionHeader>
      <AddressGrid>
        <AddressRow>
          <ParSm>Moloch v3</ParSm>
          <AddressDisplay
            address={dao.id}
            copy
            explorerNetworkId={daoChain as ValidNetwork}
            truncate
          />
        </AddressRow>
        <AddressRow>
          <ParSm>Gnosis Safe (Treasury)</ParSm>
          <AddressDisplay
            address={dao.safeAddress}
            copy
            truncate
            explorerNetworkId={daoChain as ValidNetwork}
          />
        </AddressRow>
        <AddressRow>
          <ParSm>Voting Token</ParSm>
          <AddressDisplay
            address={dao.sharesAddress}
            copy
            truncate
            explorerNetworkId={daoChain as ValidNetwork}
          />
        </AddressRow>
        <AddressRow>
          <ParSm>Non-Voting Token</ParSm>
          <AddressDisplay
            address={dao.lootAddress}
            copy
            truncate
            explorerNetworkId={daoChain as ValidNetwork}
          />
        </AddressRow>
      </AddressGrid>
    </SettingsSection>
  );
};
