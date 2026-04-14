import { useMemo } from 'react';
import styled from 'styled-components';
import { mintDark, slateDark, tomatoDark } from '@radix-ui/colors';

import { Progress } from '@/lib/ui';
import { percentage } from '@/lib/utils';
import type { ProposalItem } from '@/lib/dao-hooks';

const VoteBarBox = styled.div`
  width: 100%;
  margin-bottom: 1.2rem;
`;

export const VoteBar = ({ proposal }: { proposal: ProposalItem }) => {
  const sections = useMemo(
    () => [
      {
        percentage: `${percentage(
          Number(proposal.yesBalance),
          Number(proposal.dao.totalShares)
        )}%`,
        color: mintDark.mint10,
      },
      {
        percentage: `${percentage(
          Number(proposal.noBalance),
          Number(proposal.dao.totalShares)
        )}%`,
        color: tomatoDark.tomato10,
      },
    ],
    [proposal]
  );

  return (
    <VoteBarBox>
      <Progress backgroundColor={slateDark.slate8} progressSection={sections} />
    </VoteBarBox>
  );
};
