import { Italic, Link, ParSm } from '@/lib/ui';
import { generateExplorerLink, isValidNetwork } from '@/lib/keychain-utils';
import type { ValidNetwork } from '@/lib/keychain-utils';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ActionTemplate } from './ActionPrimitives';
import { VoteBar } from '@/components/VoteBar';

export const ActionFailed = ({
  proposal,
  daoChain,
}: {
  proposal: ProposalItem;
  daoChain: string;
}) => {
  const txLink =
    proposal.processTxHash && isValidNetwork(daoChain)
      ? generateExplorerLink({
          chainId: daoChain as ValidNetwork,
          address: proposal.processTxHash,
          type: 'tx',
        })
      : undefined;

  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay="External Action Failed"
      main={<VoteBar proposal={proposal} />}
      helperDisplay={
        <ParSm>
          <Italic>
            The external contract interaction failed.{' '}
            {txLink && (
              <>
                See{' '}
                <Link href={txLink} target="_blank" rel="noopener noreferrer">
                  transaction details
                </Link>{' '}
                for more information.
              </>
            )}
          </Italic>
        </ParSm>
      }
    />
  );
};
