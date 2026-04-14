import styled from "styled-components";

import { DataIndicator } from "@/lib/ui";
import type { ProposalItem } from "@/lib/dao-hooks";
import { formatShortDateTimeFromSeconds } from "@/lib/utils";

const TimelineGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

type ProposalTimelineProps = {
  proposal: ProposalItem;
};

export const ProposalTimeline = ({ proposal }: ProposalTimelineProps) => {
  return (
    <TimelineGrid>
      {proposal.sponsorTxAt && (
        <DataIndicator
          label="Sponsored"
          data={formatShortDateTimeFromSeconds(proposal.sponsorTxAt) ?? "—"}
          size="sm"
        />
      )}
      {proposal.votingEnds && Number(proposal.votingEnds) > 0 && (
        <DataIndicator
          label="Voting Ends"
          data={formatShortDateTimeFromSeconds(proposal.votingEnds) ?? "—"}
          size="sm"
        />
      )}
      {proposal.graceEnds && Number(proposal.graceEnds) > 0 && (
        <DataIndicator
          label="Grace Ends"
          data={formatShortDateTimeFromSeconds(proposal.graceEnds) ?? "—"}
          size="sm"
        />
      )}
      {proposal.expiration && Number(proposal.expiration) > 0 && (
        <DataIndicator
          label="Expires"
          data={formatShortDateTimeFromSeconds(proposal.expiration) ?? "—"}
          size="sm"
        />
      )}
    </TimelineGrid>
  );
};
