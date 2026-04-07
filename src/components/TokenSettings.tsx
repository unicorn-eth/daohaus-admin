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
};

export const TokenSettings = ({ dao }: TokenSettingsProps) => {
  return (
    <SettingsSection>
      <SectionHeader>
        <H3>DAO Tokens</H3>
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
