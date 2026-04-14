import styled from "styled-components";

import type { DaoItem } from "@/lib/dao-hooks";
import { Card, DataIndicator, H4, widthQuery } from "@/lib/ui";
import {
  charLimit,
  formatValueTo,
  fromWei,
  lowerCaseLootToken,
} from "@/lib/utils";
import { DaoProfile } from "./DaoProfile";

// ---- styles -----------------------------------------------------------------

const OverviewCard = styled(Card)`
  width: 64rem;
  padding: 2rem;
  border: none;
  margin-bottom: 3.4rem;
  @media ${widthQuery.md} {
    max-width: 100%;
    min-width: 0;
  }
`;

const SectionCard = styled(OverviewCard)`
  padding: 2.4rem;
`;

const DataGrid = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;

  div {
    padding: 2rem 0;
  }
`;

const SectionHeader = styled(H4)`
  margin-bottom: 0.8rem;
`;

// ---- component --------------------------------------------------------------

type DaoOverviewCardProps = {
  dao: DaoItem;
};

export const DaoOverviewCard = ({ dao }: DaoOverviewCardProps) => {
  return (
    <>
      {/* Profile + member/proposal stats */}
      <OverviewCard>
        <DaoProfile dao={dao} />
        <DataGrid>
          <DataIndicator label="Members" data={dao.activeMemberCount} />
          <DataIndicator label="Proposals" data={dao.proposalCount} />
          <DataIndicator
            label="Active Proposals"
            data={dao.activeProposals?.length ?? 0}
          />
        </DataGrid>
      </OverviewCard>

      {/* Token info */}
      <SectionCard>
        <SectionHeader>Tokens</SectionHeader>
        <DataGrid>
          <DataIndicator
            label="Voting Token"
            data={charLimit(dao.shareTokenName, 20)}
          />
          <DataIndicator
            label="Voting Supply"
            data={formatValueTo({
              value: fromWei(dao.totalShares),
              decimals: 2,
              format: "numberShort",
            })}
          />
        </DataGrid>
        <DataGrid>
          <DataIndicator
            label="Non-Voting Token"
            data={charLimit(lowerCaseLootToken(dao.lootTokenName), 20)}
          />
          <DataIndicator
            label="Non-Voting Supply"
            data={formatValueTo({
              value: fromWei(dao.totalLoot),
              decimals: 2,
              format: "numberShort",
            })}
          />
        </DataGrid>
      </SectionCard>
    </>
  );
};
