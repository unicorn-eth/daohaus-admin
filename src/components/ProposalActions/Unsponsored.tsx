import React, { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useTheme } from 'styled-components';

import { GatedButton, Italic, ParMd, Loading, useBreakpoint, useToast, widthQuery } from '@/lib/ui';
import {
  fromWei,
  handleErrorMessage,
  isNumberish,
  PROP_CARD_HELP,
  TXLego,
} from '@/lib/utils';
import { useTxBuilder } from '@/lib/tx-builder';
import { useConnectedMember } from '@/hooks/useConnectedMember';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { useDao } from '@/lib/dao-hooks';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ACTION_TX } from './legos';
import { ActionTemplate } from './ActionPrimitives';
import { VoteBar } from '@/components/VoteBar';

export const Unsponsored = ({
  proposal,
  daoChain,
  daoId,
}: {
  proposal: ProposalItem;
  daoChain: string;
  daoId: string;
}) => {
  const { address } = useAccount();
  const wagmiChainId = useChainId();
  const chainId = wagmiChainId ? `0x${wagmiChainId.toString(16)}` : undefined;

  const { fireTransaction } = useTxBuilder();
  const { connectedMember } = useConnectedMember();
  const { errorToast, defaultToast, successToast } = useToast();
  const { daoChain: ctxChain, daoId: ctxDaoId } = useCurrentDao();
  const { dao } = useDao({ chainid: ctxChain, daoid: ctxDaoId });
  const isMobile = useBreakpoint(widthQuery.sm);
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSponsor = () => {
    const { proposalId } = proposal;
    if (!proposalId) return;
    setIsLoading(true);
    fireTransaction({
      tx: { ...ACTION_TX.SPONSOR, staticArgs: [proposalId] } as TXLego,
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({ error });
          errorToast({ title: 'Sponsor Failed', description: errMsg });
          setIsLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: 'Sponsor Success',
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
            title: 'Sponsor Success',
            description: 'Proposal sponsored',
          });
          setIsLoading(false);
        },
      },
    });
  };

  const hasDelegatedShares = useMemo(() => {
    if (
      dao &&
      isNumberish(connectedMember?.delegateShares) &&
      isNumberish(dao.sponsorThreshold)
    ) {
      return Number(connectedMember?.delegateShares) >= Number(dao.sponsorThreshold)
        ? true
        : `${fromWei(dao.sponsorThreshold)} delegated voting tokens are required to sponsor this proposal.`;
    }
    return 'Subgraph data not loading or is not in sync';
  }, [dao, connectedMember]);

  const isConnectedToDao =
    chainId === daoChain
      ? true
      : 'You are not connected to the same network as the DAO';

  const notDelegating = useMemo(() => {
    if (connectedMember?.delegatingTo && isNumberish(connectedMember?.delegateShares)) {
      return Number(connectedMember.delegateShares) > 0
        ? true
        : 'You cannot sponsor a proposal as you have delegated your voting power';
    }
    return address ? 'Subgraph syncing…' : 'Connect your wallet';
  }, [connectedMember, address]);

  return (
    <ActionTemplate
      statusDisplay="Needs a Sponsor"
      proposal={proposal}
      main={
        <>
          <VoteBar proposal={proposal} />
          <GatedButton
            size="sm"
            rules={[hasDelegatedShares, isConnectedToDao, notDelegating]}
            onClick={handleSponsor}
            fullWidth={isMobile}
          >
            {isLoading ? <Loading size={20} /> : 'Sponsor Proposal'}
          </GatedButton>
        </>
      }
      helperDisplay={
        <ParMd color={theme.secondary.step11}>
          <Italic>{PROP_CARD_HELP.UNSPONSORED}</Italic>
          {typeof notDelegating === 'string' && <Italic> {notDelegating}</Italic>}
        </ParMd>
      }
    />
  );
};
