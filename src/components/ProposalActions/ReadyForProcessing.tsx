import React, { useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import styled from 'styled-components';

import { GatedButton, useBreakpoint, useToast, widthQuery } from '@/lib/ui';
import {
  checkHasQuorum,
  createViemClient,
  getProcessingGasLimit,
  handleErrorMessage,
  roundedPercentage,
  TXLego,
} from '@/lib/utils';
import {
  isValidNetwork,
  ValidNetwork,
} from '@/lib/keychain-utils';
import { LOCAL_ABI } from '@/lib/abis';
import { useTxBuilder } from '@/lib/tx-builder';
import type { ProposalItem } from '@/lib/dao-hooks';

import { ACTION_TX } from './legos';
import { ActionTemplate, GasDisplay, Verdict } from './ActionPrimitives';
import { VoteBar } from '@/components/VoteBar';

type EthAddress = `0x${string}`;

const ProcessBox = styled.div`
  display: flex;
  justify-content: flex-start;
  .execute {
    margin-left: auto;
  }
  @media ${widthQuery.sm} {
    flex-direction: column;
    gap: 1.2rem;
    .execute {
      min-width: 0;
      width: 100%;
    }
  }
`;

const eligibleStatuses = [0, 6, 7, 3];

const checkCanProcess = async ({
  daoId,
  daoChain,
  prevProposalId,
  setCanProcess,
}: {
  daoId: string;
  daoChain: ValidNetwork;
  prevProposalId: string;
  setCanProcess: React.Dispatch<React.SetStateAction<string | true>>;
}) => {
  try {
    const client = createViemClient({ chainId: daoChain });
    const state = await client.readContract({
      abi: LOCAL_ABI.BAAL,
      address: daoId as EthAddress,
      functionName: 'state',
      args: [prevProposalId],
    });
    setCanProcess(
      eligibleStatuses.some((s) => s === state)
        ? true
        : 'Another proposal in the DAO needs to be executed first.'
    );
  } catch {
    setCanProcess('Network Error. Could not check for Proposal status');
  }
};

export const ReadyForProcessing = ({
  proposal,
  daoChain,
  daoId,
}: {
  proposal: ProposalItem;
  daoChain: string;
  daoId: string;
}) => {
  const wagmiChainId = useChainId();
  const chainId = wagmiChainId ? `0x${wagmiChainId.toString(16)}` : undefined;

  const { fireTransaction } = useTxBuilder();
  const { errorToast, defaultToast, successToast } = useToast();
  const isMobile = useBreakpoint(widthQuery.sm);

  const [canProcess, setCanProcess] = React.useState<string | true>('Checking execution data.');
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (daoId && isValidNetwork(daoChain)) {
      checkCanProcess({
        daoChain: daoChain as ValidNetwork,
        daoId,
        prevProposalId: proposal.prevProposalId,
        setCanProcess,
      });
    }
  }, [proposal, daoId, daoChain]);

  const processProposal = async () => {
    const { proposalId, proposalData, actionGasEstimate } = proposal;
    if (!proposalId) return;
    setIsLoading(true);
    await fireTransaction({
      tx: {
        ...ACTION_TX.PROCESS,
        staticArgs: [proposalId, proposalData],
        staticOverrides: {
          gasLimit: getProcessingGasLimit(actionGasEstimate, chainId as string),
        },
      } as TXLego,
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({ error });
          errorToast({ title: 'Execution Failed', description: errMsg });
          setIsLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: 'Execution Success',
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
            title: 'Execution Success',
            description: 'Proposal executed',
          });
          setIsLoading(false);
        },
      },
    });
  };

  const isConnectedToDao =
    chainId === daoChain
      ? true
      : 'You are not connected to the same network as the DAO';

  const isNotLoading = !isLoading ? true : 'Please wait for transaction to complete';

  const percentYes = roundedPercentage(
    Number(proposal.yesBalance),
    Number(proposal.dao.totalShares)
  );

  const failedQuorum = !checkHasQuorum({
    yesVotes: Number(proposal.yesBalance),
    quorumPercent: Number(proposal.dao.quorumPercent),
    totalShares: Number(proposal.dao.totalShares),
  });

  return (
    <ActionTemplate
      proposal={proposal}
      statusDisplay="Ready for Execution"
      main={
        <>
          <VoteBar proposal={proposal} />
          <Verdict
            passed={!failedQuorum}
            appendText={!failedQuorum ? ` - ${percentYes}% Yes` : ' - Quorum not met'}
          />
        </>
      }
      helperDisplay={
        <ProcessBox>
          {Number(proposal.actionGasEstimate) > 0 && (
            <GasDisplay gasAmt={proposal.actionGasEstimate} daoChain={daoChain} />
          )}
          <GatedButton
            size="sm"
            onClick={processProposal}
            className="execute"
            rules={[isConnectedToDao, isNotLoading, canProcess]}
            fullWidth={isMobile}
          >
            Execute
          </GatedButton>
        </ProcessBox>
      }
    />
  );
};
