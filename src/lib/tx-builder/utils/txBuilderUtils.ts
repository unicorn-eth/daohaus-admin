import { getAccount, getPublicClient, getWalletClient } from '@wagmi/core';
import { Hash, zeroAddress } from 'viem';

import { ABI, ArbitraryState, ReactSetter, TXLego } from '@/lib/utils';
import {
  ABI_EXPLORER_KEYS,
  ENDPOINTS,
  HAUS_RPC,
  Keychain,
  ValidNetwork,
  VIEM_CHAINS,
} from '@/lib/keychain-utils';
import { formatFetchError } from '@/lib/data-fetch-utils';
import { wagmiConfig } from '@/lib/wagmi-config';

import { pollLastTX, standardGraphPoll, testLastTX } from './polling';
import { processArgs } from './args';
import { processContractLego } from './contractHelpers';
import { ArgCallback, TXLifeCycleFns } from '../TXBuilder';
import { processOverrides } from './overrides';

export type TxRecord = Record<string, TXLego>;
export type MassState = {
  tx: TXLego;
  chainId: ValidNetwork;
  safeId?: string;
  daoid?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const executeTx = async (args: {
  tx: TXLego;
  txHash: Hash;
  setTransactions: ReactSetter<TxRecord>;
  chainId: ValidNetwork;
  lifeCycleFns?: TXLifeCycleFns;
  appState: ArbitraryState;
}) => {
  const { tx, txHash, setTransactions, chainId, lifeCycleFns, appState } = args;
  console.log('**Transaction Initiated**', txHash);

  const publicClient = getPublicClient(wagmiConfig, {
    chainId: VIEM_CHAINS[chainId]?.id as
      | 1
      | 10
      | 100
      | 8453
      | 42161
      | 11155111
      | undefined,
  });

  try {
    lifeCycleFns?.onTxHash?.(txHash);
    setTransactions((prev) => ({ ...prev, [txHash]: { ...tx, status: 'idle' } }));
    console.log('**Transaction Pending**');

    if (!publicClient) throw new Error('Public client not available');
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log('**Transaction Mined**', receipt);

    if (receipt.status === 'reverted') {
      throw new Error('CALL_EXCEPTION: txReceipt status 0');
    }

    setTransactions((prev) => ({ ...prev, [txHash]: { ...tx, status: 'polling' } }));
    console.log('**Transaction Successful**');
    lifeCycleFns?.onTxSuccess?.(receipt, txHash, appState);

    if (!tx.disablePoll) {
      standardGraphPoll({
        poll: tx?.customPoll?.fetch || pollLastTX,
        test: tx?.customPoll?.test || testLastTX,
        variables: [{ chainId, txHash }],
        onPollStart() {
          lifeCycleFns?.onPollStart?.();
          console.log('**Polling**');
        },
        onPollSuccess(result) {
          lifeCycleFns?.onPollSuccess?.(result, receipt, appState);
          console.log('**Poll Successful**');
          setTransactions((prev) => ({ ...prev, [txHash]: { ...tx, status: 'success' } }));
        },
        onPollError(error) {
          lifeCycleFns?.onPollError?.(error);
          console.log('**Poll Error**');
          setTransactions((prev) => ({ ...prev, [txHash]: { ...tx, status: 'pollFailed' } }));
        },
      });
    }
    return { receipt, txHash };
  } catch (error) {
    console.error('**TX Error**', error);

    if (String(error).indexOf('TransactionNotFoundError') > -1) {
      console.log('**TransactionNotFoundError — checking Safe service**');
      await sleep(6000);
      const url = ENDPOINTS['GNOSIS_API'][chainId];
      if (!url) {
        return { error: formatFetchError({ type: 'INVALID_NETWORK_ERROR' }) };
      }
      try {
        const safeRes = await fetch(`${url}/multisig-transactions/${txHash}`);
        const safeReceipt = await safeRes.json() as { transactionHash: `0x${string}` };
        console.log('**Rerun with Safe onchain hash**', safeReceipt.transactionHash);
        executeTx({ ...args, txHash: safeReceipt.transactionHash || txHash });
      } catch (err) {
        console.error(formatFetchError({ type: 'GNOSIS_ERROR', errorObject: err }));
        setTransactions((prev) => ({ ...prev, [txHash]: { ...tx, status: 'success' } }));
        lifeCycleFns?.onPollSuccess?.(
          'Something went wrong retrieving the transaction hash.',
          {
            blockHash: zeroAddress,
            blockNumber: BigInt(0),
            from: zeroAddress,
            status: 'success',
            contractAddress: zeroAddress,
            cumulativeGasUsed: BigInt(0),
            effectiveGasPrice: BigInt(0),
            gasUsed: BigInt(0),
            logs: [],
            logsBloom: zeroAddress,
            to: zeroAddress,
            transactionHash: txHash,
            transactionIndex: 0,
            type: 'none',
          },
          appState
        );
      }
    } else {
      lifeCycleFns?.onTxError?.(error);
      setTransactions((prev) => ({ ...prev, [txHash]: { ...tx, status: 'failed' } }));
    }
  }
};

export async function prepareTX(args: {
  tx: TXLego;
  chainId: ValidNetwork;
  safeId?: string;
  setTransactions: ReactSetter<TxRecord>;
  appState: ArbitraryState;
  lifeCycleFns: TXLifeCycleFns;
  localABIs: Record<string, ABI>;
  argCallbackRecord: Record<string, ArgCallback>;
  rpcs?: Keychain;
  explorerKeys?: Keychain;
}) {
  const {
    argCallbackRecord,
    tx,
    chainId,
    safeId,
    localABIs,
    lifeCycleFns,
    appState,
    rpcs = HAUS_RPC,
    explorerKeys = ABI_EXPLORER_KEYS,
  } = args;

  console.log('**APPLICATION STATE**', appState);
  try {
    const processedContract = await processContractLego({
      localABIs,
      contract: tx.contract,
      chainId,
      appState,
      rpcs,
      explorerKeys,
    });
    console.log('**PROCESSED CONTRACT**', processedContract);

    const { abi, address } = processedContract;
    const { method } = tx;

    const processedArgs = await processArgs({
      tx: { ...tx, contract: processedContract },
      localABIs,
      chainId,
      safeId,
      appState,
      argCallbackRecord,
      rpcs,
      explorerKeys,
    });
    console.log('**PROCESSED ARGS**', processedArgs);

    const overrides = await processOverrides({
      tx,
      localABIs,
      chainId,
      safeId,
      appState,
      rpcs,
      explorerKeys,
    });
    console.log('**PROCESSED OVERRIDES**', overrides);

    const { address: account } = getAccount(wagmiConfig);
    const numericChainId = VIEM_CHAINS[chainId]?.id;
    if (!numericChainId) throw new Error(`No viem chain found for chainId: ${chainId}`);

    const walletClient = await getWalletClient(wagmiConfig, {
      chainId: numericChainId as 1 | 10 | 100 | 8453 | 42161 | 11155111,
    });
    if (!walletClient) throw new Error('Wallet client not found');

    const publicClient = getPublicClient(wagmiConfig, {
      chainId: numericChainId as 1 | 10 | 100 | 8453 | 42161 | 11155111,
    });
    if (!publicClient) throw new Error('Public client not found');

    const { request } = await (publicClient as any).simulateContract({
      account,
      address: address as `0x${string}`,
      abi,
      args: processedArgs,
      functionName: method,
      value: overrides.value,
      gas: overrides.gasLimit,
      maxFeePerGas: overrides.gasPrice,
      blockTag: overrides.blockTag,
    });

    lifeCycleFns?.onRequestSign?.();
    const txHash = await walletClient.writeContract(request);
    console.log('txHash', txHash);

    executeTx({ tx, txHash, setTransactions: args.setTransactions, chainId, lifeCycleFns, appState });
  } catch (error) {
    console.error(error);
    lifeCycleFns?.onTxError?.(error);
  }
}
