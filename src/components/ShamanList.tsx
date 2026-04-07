import styled from "styled-components";
import { indigoDark } from "@radix-ui/colors";

import { H3, ParSm, DataSm, AddressDisplay } from "@/lib/ui";
import type { ValidNetwork } from "@/lib/keychain-utils";
import type { DaoItem, ShamanItem } from "@/lib/dao-hooks";

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
  margin-bottom: 2rem;
`;

const Description = styled.div`
  margin-bottom: 2.4rem;
`;

const ShamanRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1.2rem 0;
  border-bottom: 1px solid ${indigoDark.indigo5};
  gap: 1.2rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ShamanAddress = styled.div`
  flex: 1 1 60%;
  min-width: 20rem;
`;

const ShamanPermissions = styled.div`
  flex: 0 0 auto;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0.6rem 0;
  border-bottom: 1px solid ${indigoDark.indigo6};
  margin-bottom: 0.4rem;
  gap: 1.2rem;
`;

const HeaderContract = styled.div`
  flex: 1 1 60%;
`;

const HeaderPermissions = styled.div`
  flex: 0 0 auto;
`;

// ── Component ────────────────────────────────────────────────────────────────

type ShamanListProps = {
  dao: DaoItem;
  daoChain: string;
};

export const ShamanList = ({ dao, daoChain }: ShamanListProps) => {
  return (
    <SettingsSection>
      <SectionHeader>
        <H3>Shamans</H3>
      </SectionHeader>
      <Description>
        <ParSm>
          Shamans are contracts that can adjust governance settings, token
          settings, and memberships without proposals. Because shamans can
          affect the security of the DAO, be cautious when adding new shamans,
          and remove any that are no longer needed.
        </ParSm>
      </Description>

      {!dao.shamen || dao.shamen.length === 0 ? (
        <ParSm>No shamans.</ParSm>
      ) : (
        <>
          <HeaderRow>
            <HeaderContract>
              <DataSm>Contract</DataSm>
            </HeaderContract>
            <HeaderPermissions>
              <DataSm>Permissions</DataSm>
            </HeaderPermissions>
          </HeaderRow>
          {dao.shamen.map((shaman: ShamanItem) => (
            <ShamanRow key={`${shaman.id}-${shaman.permissions}`}>
              <ShamanAddress>
                <AddressDisplay
                  address={shaman.shamanAddress}
                  explorerNetworkId={daoChain as ValidNetwork}
                  truncate
                  copy
                />
              </ShamanAddress>
              <ShamanPermissions>
                <DataSm>{shaman.permissions}</DataSm>
              </ShamanPermissions>
            </ShamanRow>
          ))}
        </>
      )}
    </SettingsSection>
  );
};
