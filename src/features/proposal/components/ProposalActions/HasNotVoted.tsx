import React, { MouseEvent } from 'react';
import { useChainId } from 'wagmi';

import { ParMd, TintSecondary, useToast } from '@/lib/ui';
import { formatShares, handleErrorMessage, TXLego } from '@/lib/utils';
import { useTxBuilder } from '@/lib/tx-builder';
import { useConnectedMember } from '@/features/dao/hooks/useConnectedMember';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ACTION_TX } from './legos';
import { ActionTemplate, VoteBox, VoteDownButton, VoteUpButton } from './ActionPrimitives';
import { VoteBar } from '../VoteBar';

const Vote = {
  Yes: 'yes',
  No: 'no',
} as const;

type Vote = (typeof Vote)[keyof typeof Vote];

export const HasNotVoted = ({
  proposal,
  readableTime,
  daoChain,
}: {
  proposal: ProposalItem;
  daoChain: string;
  daoId: string;
  readableTime?: string;
}) => {
  const wagmiChainId = useChainId();
  const chainId = wagmiChainId ? `0x${wagmiChainId.toString(16)}` : undefined;

  const { connectedMember } = useConnectedMember();
  const { fireTransaction } = useTxBuilder();
  const { errorToast, defaultToast, successToast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleVote = async (e: MouseEvent<HTMLButtonElement>) => {
    const { proposalId } = proposal;
    const vote = e.currentTarget.value as Vote;
    if (!proposalId || !vote) return;
    const voteValue = vote === Vote.Yes;

    setIsLoading(true);
    await fireTransaction({
      tx: { ...ACTION_TX.VOTE, staticArgs: [proposalId, voteValue] } as TXLego,
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({ error });
          errorToast({ title: 'Vote Failed', description: errMsg });
          setIsLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: 'Vote Success',
            description: 'Please wait for subgraph to sync',
          });
        },
        onPollError: (error) => {
          const errMsg = handleErrorMessage({ error });
          errorToast({ title: 'Poll Error', description: errMsg });
          setIsLoading(false);
        },
        onPollSuccess: () => {
          successToast({
            title: 'Vote Success',
            description: 'Vote recorded',
          });
          setIsLoading(false);
        },
      },
    });
  };

  const readableVotePower =
    connectedMember && Number(connectedMember?.delegateShares)
      ? `Cast Your Vote (${formatShares(connectedMember.delegateShares)})`
      : undefined;

  const hasShares = Number(connectedMember?.delegateShares)
    ? true
    : 'You must have voting tokens to vote';

  const isConnectedToDao =
    chainId === daoChain
      ? true
      : 'You are not connected to the same network as the DAO';

  const isNotLoading = !isLoading
    ? true
    : 'Please wait for transaction to complete';

  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay={
        <ParMd>
          Voting ends in <TintSecondary>{readableTime}</TintSecondary>
        </ParMd>
      }
      main={
        <div>
          <VoteBar proposal={proposal} />
          <VoteBox>
            <VoteDownButton
              size="sm"
              rules={[hasShares, isConnectedToDao, isNotLoading]}
              value={Vote.No}
              onClick={handleVote}
            >
              No ({formatShares(proposal.noBalance)})
            </VoteDownButton>
            <VoteUpButton
              size="sm"
              rules={[hasShares, isConnectedToDao, isNotLoading]}
              value={Vote.Yes}
              onClick={handleVote}
            >
              Yes ({formatShares(proposal.yesBalance)})
            </VoteUpButton>
          </VoteBox>
        </div>
      }
      helperDisplay={readableVotePower}
    />
  );
};
