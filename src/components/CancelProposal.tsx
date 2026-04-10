import { useMemo, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';

import { GatedButton, Loading, useToast } from '@/lib/ui';
import { getProposalStatus, handleErrorMessage, isGovernor, PROPOSAL_STATUS, TXLego } from '@/lib/utils';
import { useTxBuilder } from '@/lib/tx-builder';
import { useDao } from '@/lib/dao-hooks';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ACTION_TX } from './ProposalActions/legos';

export const CancelProposal = ({
  proposal,
  onSuccess,
}: {
  proposal: ProposalItem;
  onSuccess: () => void;
}) => {
  const { daoChain, daoId } = useCurrentDao();
  const { dao, isLoading: isLoadingDao } = useDao({ chainid: daoChain, daoid: daoId });
  const { address } = useAccount();
  const wagmiChainId = useChainId();
  const chainId = wagmiChainId ? `0x${wagmiChainId.toString(16)}` : undefined;

  const { fireTransaction } = useTxBuilder();
  const { errorToast, defaultToast, successToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    const { proposalId } = proposal;
    if (!proposalId) return;
    setIsLoading(true);
    fireTransaction({
      tx: { ...ACTION_TX.CANCEL, staticArgs: [proposalId] } as TXLego,
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({ error });
          errorToast({ title: 'Cancel Failed', description: errMsg });
          setIsLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: 'Cancel Success',
            description: 'Please wait for subgraph to sync',
          });
        },
        onPollError: (error) => {
          const errMsg = handleErrorMessage({ error });
          errorToast({ title: 'Poll Error', description: errMsg });
          setIsLoading(false);
        },
        onPollSuccess: () => {
          successToast({ title: 'Cancel Success', description: 'Proposal cancelled' });
          setIsLoading(false);
          onSuccess();
        },
      },
    });
  };

  const daoExists = !dao && !isLoadingDao ? 'DAO does not exist' : true;

  const isConnectedToDao =
    chainId === daoChain
      ? true
      : 'You are not connected to the same network as the DAO';

  const addressCanCancel = useMemo(() => {
    const isProposer =
      proposal.createdBy.toLowerCase() === address?.toLowerCase();

    const sponsorBelowThreshold =
      Number(proposal.sponsorMembership?.delegateShares) <
      Number(dao?.sponsorThreshold);

    const isGovernorShaman = dao?.shamen?.some(
      (shaman) =>
        shaman.shamanAddress.toLowerCase() === address?.toLowerCase() &&
        isGovernor(shaman.permissions)
    );

    return isProposer || sponsorBelowThreshold || isGovernorShaman
      ? true
      : `Proposal can only be cancelled by the sponsor, by a governance shaman, or by anyone if the sponsor's voting token balance has fallen below the sponsor threshold`;
  }, [proposal, address, dao]);

  if (getProposalStatus(proposal) !== PROPOSAL_STATUS.voting) {
    return null;
  }

  return (
    <GatedButton
      color="secondary"
      rules={[daoExists, isConnectedToDao, addressCanCancel]}
      onClick={handleCancel}
    >
      {isLoading ? <Loading size={20} /> : 'Cancel'}
    </GatedButton>
  );
};
