import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

import { H3, H4, DataIndicator, widthQuery } from "@/lib/ui";
import { charLimit, formatValueTo, fromWei, lowerCaseLootToken } from "@/lib/utils";
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
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
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
  padding: 0.9rem 1.2rem;
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

const TokenDataGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 0;
  div {
    margin-top: 3rem;
    width: 22.7rem;
    @media ${widthQuery.sm} {
      min-width: 100%;
    }
  }
`;

// ── Component ────────────────────────────────────────────────────────────────

type TokenSettingsProps = {
  dao: DaoItem;
  daoChain: string;
};

export const TokenSettings = ({ dao, daoChain }: TokenSettingsProps) => {
  const defaultValues = useMemo(
    () => ({
      vStake: dao.sharesPaused,
      nvStake: dao.lootPaused,
    }),
    [dao],
  );
  const updateTokensPath = `/molochv3/${daoChain}/${dao.id}/new-proposal?formLego=TOKEN_SETTINGS&defaultValues=${encodeURIComponent(
    JSON.stringify(defaultValues),
  )}`;

  return (
    <SettingsSection>
      <SectionHeader>
        <H3>DAO Tokens</H3>
        <ButtonRouterLink to={updateTokensPath}>Update Tokens</ButtonRouterLink>
      </SectionHeader>

      <H4>Voting</H4>
      <TokenDataGrid>
        <DataIndicator
          size="sm"
          label="Total"
          data={formatValueTo({
            value: fromWei(dao.totalShares),
            decimals: 2,
            format: "number",
          })}
        />
        <DataIndicator size="sm" label="Symbol" data={dao.shareTokenSymbol} />
        <DataIndicator
          size="sm"
          label="Name"
          data={charLimit(dao.shareTokenName, 12)}
        />
        <DataIndicator
          size="sm"
          label="Transferability"
          data={dao.sharesPaused ? "Off" : "On"}
        />
      </TokenDataGrid>

      <H4>Non-Voting</H4>
      <TokenDataGrid>
        <DataIndicator
          size="sm"
          label="Total"
          data={formatValueTo({
            value: fromWei(dao.totalLoot),
            decimals: 2,
            format: "number",
          })}
        />
        <DataIndicator size="sm" label="Symbol" data={dao.lootTokenSymbol} />
        <DataIndicator
          size="sm"
          label="Name"
          data={charLimit(lowerCaseLootToken(dao.lootTokenName), 12)}
        />
        <DataIndicator
          size="sm"
          label="Transferability"
          data={dao.lootPaused ? "Off" : "On"}
        />
      </TokenDataGrid>
    </SettingsSection>
  );
};
