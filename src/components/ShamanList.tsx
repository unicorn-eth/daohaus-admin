import { Link as RouterLink } from "react-router-dom";
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

const ShamanActions = styled.div`
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

const HeaderActions = styled.div`
  flex: 0 0 auto;
`;

const ButtonRouterLink = styled(RouterLink)`
  align-items: center;
  background-color: ${({ theme }) => theme.button.secondary.solid.bg};
  border: 0.1rem solid ${({ theme }) => theme.button.secondary.solid.border};
  border-radius: ${({ theme }) => theme.button.radius};
  color: ${({ theme }) => theme.button.secondary.solid.text};
  cursor: pointer;
  display: inline-flex;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  height: 3.6rem;
  justify-content: center;
  letter-spacing: 1.8px;
  min-width: 6.6rem;
  padding: 0.9rem;
  text-decoration: none;
  transition: 0.2s all;

  &:hover {
    background-color: ${({ theme }) => theme.button.secondary.solid.bgHover};
    border-color: ${({ theme }) => theme.button.secondary.solid.borderHover};
    text-decoration: none;
  }

  &:focus {
    background-color: ${({ theme }) => theme.button.secondary.solid.bgFocus};
    border-color: ${({ theme }) => theme.button.secondary.solid.borderFocus};
    outline: none;
  }
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
            <HeaderActions>
              <DataSm>Manage</DataSm>
            </HeaderActions>
          </HeaderRow>
          {dao.shamen.map((shaman: ShamanItem) => {
            const managePath = `/molochv3/${daoChain}/${dao.id}/new-proposal?formLego=UPDATE_SHAMAN&defaultValues=${encodeURIComponent(
              JSON.stringify({
                shamanAddress: shaman.shamanAddress,
                shamanPermission: shaman.permissions,
              }),
            )}`;

            return (
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
                <ShamanActions>
                  <ButtonRouterLink to={managePath}>Manage</ButtonRouterLink>
                </ShamanActions>
              </ShamanRow>
            );
          })}
        </>
      )}
    </SettingsSection>
  );
};
