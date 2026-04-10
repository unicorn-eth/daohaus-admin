import { padHex, toHex } from 'viem';
import {
  ABI,
  ArbitraryState,
  ArgEncode,
  ArgType,
  EncodeCallArg,
  encodeFunction,
  encodeValues,
  EstimateGas,
  EthAddress,
  EncodeMulticall,
  JSONDetailsSearch,
  MulticallAction,
  MulticallArg,
  StringSearch,
  TXLego,
  ACTION_GAS_LIMIT_ADDITION,
} from '@/lib/utils';
import {
  CONTRACT_KEYCHAINS,
  HAUS_RPC,
  Keychain,
  ValidNetwork,
} from '@/lib/keychain-utils';
import { LOCAL_ABI } from '@/lib/abis';
import { MetaTransaction, OperationType } from 'ethers-multisend';

import { processArg } from './args';
import {
  BaalContractBase,
  basicDetails,
  CURRENT_DAO,
  EXPIRY,
  FORM,
  gasBufferMultiplier,
} from './constants';
import { processContractLego } from './contractHelpers';
import { createViemClient } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Replaces encodeMultiSend from @gnosis.pm/safe-contracts using viem primitives.
// Packs an array of MetaTransactions into the bytes format expected by multiSend(bytes).
// ---------------------------------------------------------------------------
export const encodeMultiSendBytes = (txs: MetaTransaction[]): `0x${string}` => {
  const packed = txs
    .map((tx) => {
      const op = padHex(toHex(tx.operation ?? OperationType.Call), { size: 1 }).slice(2);
      const to = (tx.to as string).toLowerCase().replace(/^0x/, '').padStart(40, '0');
      const value = padHex(toHex(BigInt(tx.value ?? '0')), { size: 32 }).slice(2);
      const data = (tx.data ?? '0x').replace(/^0x/, '');
      const dataLen = padHex(toHex(data.length / 2), { size: 32 }).slice(2);
      return `${op}${to}${value}${dataLen}${data}`;
    })
    .join('');
  return `0x${packed}`;
};

// ---------------------------------------------------------------------------

export const estimateFunctionalGas = async ({
  chainId,
  contractAddress,
  from,
  value,
  data,
  rpcs = HAUS_RPC,
}: {
  chainId: ValidNetwork;
  contractAddress: string;
  from: string;
  value: bigint;
  data: string;
  rpcs?: Keychain;
}): Promise<number | undefined> => {
  const client = createViemClient({ chainId, rpcs });
  const functionGasFees = await client.estimateGas({
    account: from as EthAddress,
    to: contractAddress as EthAddress,
    value,
    data: data as `0x${string}`,
  });
  return Number(functionGasFees);
};

export const txActionToMetaTx = ({
  abi,
  method,
  address,
  args,
  value = 0,
  operation = 0,
}: {
  abi: ABI;
  address: string;
  method: string;
  args: ReadonlyArray<ArgType>;
  value?: number;
  operation?: number;
}): MetaTransaction => {
  const encodedData = encodeFunction(abi, method, args);
  if (typeof encodedData !== 'string') throw new Error(encodedData.message);
  return {
    to: address,
    data: encodedData,
    value: value.toString(),
    operation,
  };
};

export const handleEncodeCallArg = async ({
  arg,
  chainId,
  localABIs,
  appState,
  rpcs,
  explorerKeys,
}: {
  arg: EncodeCallArg;
  chainId: ValidNetwork;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  rpcs: Keychain;
  explorerKeys: Keychain;
}) => {
  const { contract, method, args } = arg.action;
  const processedContract = await processContractLego({ contract, chainId, localABIs, appState, rpcs, explorerKeys });
  const processedArgs = await Promise.all(
    args.map((a) => processArg({ arg: a, chainId, localABIs, appState, rpcs, explorerKeys }))
  );
  const encodedData = encodeFunction(processedContract.abi, method, processedArgs);
  if (typeof encodedData !== 'string') throw new Error(encodedData.message);
  return encodedData;
};

const handleMulticallFormActions = ({ appState }: { appState: ArbitraryState }): MetaTransaction[] => {
  const validTxs = appState.formValues.tx
    ? Object.keys(appState.formValues.tx).filter(
        (actionId: string) => !appState.formValues.tx[actionId].deleted
      )
    : [];
  if (!validTxs.length) throw new Error('No actions found');

  return validTxs
    .sort((a: string, b: string) =>
      Number(appState.formValues.tx[a].index) > Number(appState.formValues.tx[b].index) ? 1 : -1
    )
    .map((actionId: string) => {
      const { to, data, value, operation } = appState.formValues.tx[actionId];
      return { to, data, value, operation };
    });
};

export const handleMulticallArg = async ({
  arg,
  chainId,
  localABIs,
  appState,
  rpcs,
  explorerKeys,
}: {
  arg: MulticallArg | EncodeMulticall;
  chainId: ValidNetwork;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  rpcs: Keychain;
  explorerKeys: Keychain;
}) => {
  const encodedActions = await Promise.all(
    arg.actions.map(async (action) => {
      const { contract, method, args, value, operations, data } = action;
      const processedContract = await processContractLego({ contract, chainId, localABIs, appState, rpcs, explorerKeys });

      const processValue = value
        ? await processArg({ arg: value, chainId, localABIs, appState, rpcs, explorerKeys })
        : 0;

      const processedOperations = operations
        ? await processArg({ arg: operations, chainId, localABIs, appState, rpcs, explorerKeys })
        : 0;

      if (data) {
        return {
          to: processedContract.address,
          data: (await processArg({ arg: data, chainId, localABIs, appState, rpcs, explorerKeys })) as string,
          value: processValue.toString(),
          operation: Number(processedOperations),
        };
      }

      const processedArgs = await Promise.all(
        args.map((a) => processArg({ arg: a, chainId, localABIs, appState, rpcs, explorerKeys }))
      );

      return txActionToMetaTx({
        abi: processedContract.abi,
        method,
        address: processedContract.address,
        args: processedArgs,
        value: Number(processValue),
        operation: Number(processedOperations),
      });
    })
  );

  const encodedFormActions = arg.formActions ? handleMulticallFormActions({ appState }) : [];
  return [...encodedActions, ...encodedFormActions];
};

export const gasEstimateFromActions = async ({
  actions,
  actionsCount,
  chainId,
  daoId,
}: {
  actions: MetaTransaction[];
  actionsCount: number;
  chainId: ValidNetwork;
  daoId: string;
  safeId: string;
}) => {
  const estimatedGases = await Promise.all(
    actions.map((action) =>
      estimateFunctionalGas({
        chainId,
        contractAddress: action.to,
        from: daoId,
        value: BigInt(Number(action.value)),
        data: action.data,
      })
    )
  );

  const totalGasEstimate = estimatedGases.reduce((a, b) => (a || 0) + (b || 0), 0);
  const baalOnlyGas = actionsCount * ACTION_GAS_LIMIT_ADDITION;
  return (totalGasEstimate || 0) + baalOnlyGas;
};

export const handleEncodeMulticallArg = async ({
  arg,
  actions,
}: {
  arg: MulticallArg | EncodeMulticall;
  actions: MetaTransaction[];
}) => {
  if (arg.type === 'encodeMulticall') {
    const result = encodeMultiSendBytes(actions);
    if (typeof result !== 'string') throw new Error('Could not encode generic multicall');
    return result;
  }
  const result = encodeMultiAction(actions);
  if (typeof result !== 'string') throw new Error((result as { message: string }).message);
  return result;
};

export const handleGasEstimate = async ({
  safeId,
  chainId,
  localABIs = {},
  appState,
  arg,
  rpcs,
  explorerKeys,
}: {
  safeId?: string;
  chainId: ValidNetwork;
  arg: EstimateGas;
  appState: ArbitraryState;
  localABIs?: Record<string, ABI>;
  rpcs: Keychain;
  explorerKeys: Keychain;
}) => {
  if (!safeId) throw new Error('Safe ID is required to estimate gas');

  const actions = await handleMulticallArg({
    localABIs,
    chainId,
    appState,
    arg: { type: 'multicall', actions: arg.actions, formActions: arg.formActions },
    rpcs,
    explorerKeys,
  });

  const { daoId } = appState;
  const metaTx = {
    to: CONTRACT_KEYCHAINS.GNOSIS_MULTISEND[chainId],
    data: encodeMultiAction(actions) as string,
    value: '0',
    operation: 1,
  } as MetaTransaction;

  const gasEstimate = await gasEstimateFromActions({
    actions: encodeExecFromModule({ safeId, metaTx }),
    actionsCount: actions.length,
    chainId,
    daoId,
    safeId,
  });

  if (gasEstimate) {
    const buffer = arg.bufferPercentage || gasBufferMultiplier;
    return Math.round(Number(gasEstimate) * Number(buffer));
  }
  console.error('Failed to estimate gas');
  return 0;
};

export const encodeMultiAction = (rawMulti: MetaTransaction[]) =>
  encodeFunction(LOCAL_ABI.GNOSIS_MULTISEND, 'multiSend', [encodeMultiSendBytes(rawMulti)]);

export const encodeExecFromModule = ({
  safeId,
  metaTx,
}: {
  safeId: string;
  metaTx: MetaTransaction;
}) => [
  {
    to: safeId,
    data: encodeFunction(LOCAL_ABI.GNOSIS_MODULE, 'execTransactionFromModule', [
      metaTx.to,
      metaTx.value,
      metaTx.data,
      metaTx.operation,
    ]) as string,
    value: '0',
    operation: 0,
  } as MetaTransaction,
];

export const buildMultiCallTX = ({
  id,
  baalAddress = CURRENT_DAO,
  actions,
  JSONDetails = basicDetails,
  formActions = false,
  gasBufferPercentage,
}: {
  id: string;
  baalAddress?: StringSearch | Keychain | EthAddress;
  JSONDetails?: JSONDetailsSearch;
  actions: MulticallAction[];
  formActions?: boolean;
  gasBufferPercentage?: number;
}): TXLego => ({
  id,
  method: 'submitProposal',
  contract: {
    ...BaalContractBase,
    type: 'static',
    targetAddress: baalAddress,
  },
  args: [
    { type: 'multicall', actions, formActions },
    { type: 'proposalExpiry', search: `${FORM}${EXPIRY}`, fallback: 0 },
    { type: 'estimateGas', actions, formActions, bufferPercentage: gasBufferPercentage },
    JSONDetails,
  ],
});

export const handleArgEncode = async ({
  arg,
  chainId,
  localABIs,
  appState,
  rpcs,
  explorerKeys,
}: {
  arg: ArgEncode;
  chainId: ValidNetwork;
  safeId?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  rpcs: Keychain;
  explorerKeys: Keychain;
}) => {
  const { args, solidityTypes } = arg;
  if (args.length !== solidityTypes.length) throw new Error('Arguments and types must be the same length');

  const processedArgs = await Promise.all(
    args.map((a) => processArg({ arg: a, chainId, localABIs, appState, rpcs, explorerKeys }))
  );
  return encodeValues(solidityTypes, processedArgs);
};
