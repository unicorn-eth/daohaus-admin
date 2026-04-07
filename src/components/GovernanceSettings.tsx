import { useMemo } from "react";
import styled from "styled-components";

import { H3, ParSm, DataIndicator, widthQuery } from "@/lib/ui";
import { getNetwork } from "@/lib/keychain-utils";
import {
  formatPeriods,
  formatValueTo,
  fromWei,
  INFO_COPY,
  toWholeUnits,
} from "@/lib/utils";
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

const DataGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 0;
  div {
    margin-top: 3rem;
    width: 34rem;
    @media ${widthQuery.sm} {
      min-width: 100%;
    }
  }
`;

const Description = styled.div`
  margin-bottom: 2rem;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.primary.step10};
  &:hover {
    text-decoration: underline;
  }
`;

// ── Component ────────────────────────────────────────────────────────────────

type GovernanceSettingsProps = {
  dao: DaoItem;
  daoChain: string;
};

export const GovernanceSettings = ({ dao, daoChain }: GovernanceSettingsProps) => {
  const networkData = useMemo(() => getNetwork(daoChain), [daoChain]);

  return (
    <SettingsSection>
      <SectionHeader>
        <H3>Governance Settings</H3>
      </SectionHeader>
      <Description>
        <ParSm>
          <StyledLink
            href="https://moloch.daohaus.club/configuration/governance-configuration"
            target="_blank"
            rel="noreferrer"
          >
            Review the documentation
          </StyledLink>{" "}
          for additional details on governance settings. Updates to settings
          will go through a proposal.
        </ParSm>
      </Description>
      <DataGrid>
        <DataIndicator
          size="sm"
          label="Voting Period"
          data={formatPeriods(dao.votingPeriod)}
          info={INFO_COPY.VOTING_PERIOD}
        />
        <DataIndicator
          size="sm"
          label="Grace Period"
          data={formatPeriods(dao.gracePeriod)}
          info={INFO_COPY.GRACE_PERIOD}
        />
        <DataIndicator
          size="sm"
          label="New Offering"
          data={`${fromWei(dao.proposalOffering)} ${networkData?.symbol ?? ""}`}
          info={INFO_COPY.NEW_OFFERING}
        />
      </DataGrid>
      <DataGrid>
        <DataIndicator
          size="sm"
          label="Quorum %"
          data={formatValueTo({ value: dao.quorumPercent, format: "percent" })}
          info={INFO_COPY.QUORUM}
        />
        <DataIndicator
          size="sm"
          label="Min Retention %"
          data={formatValueTo({
            value: dao.minRetentionPercent,
            format: "percent",
          })}
          info={INFO_COPY.MIN_RETENTION}
        />
        <DataIndicator
          size="sm"
          label="Sponsor Threshold"
          data={`${toWholeUnits(dao.sponsorThreshold)} Voting Tokens`}
          info={INFO_COPY.SPONSOR_THRESHOLD}
        />
      </DataGrid>
    </SettingsSection>
  );
};
