import {
  ABI,
  ArbitraryState,
  ArgType,
  calcExpiry,
  StringSearch,
  TXLego,
  ValidArgType,
} from '@/lib/utils';
import { Keychain, ValidNetwork } from '@/lib/keychain-utils';

import { ArgCallback } from '../TXBuilder';
import {
  handleArgEncode,
  handleEncodeCallArg,
  handleEncodeMulticallArg,
  handleGasEstimate,
  handleMulticallArg,
} from './multicall';
import { handleDetailsJSON, searchArg } from './search';

export const isSearchArg = (arg: ValidArgType): arg is StringSearch =>
  typeof arg === 'string' && arg[0] === '.';

const handleKeychainArg = ({
  chainId,
  keychain,
}: {
  chainId: ValidNetwork;
  keychain: Keychain;
}) => {
  if (!keychain[chainId]) throw new Error(`Could not find keychain for chainId: ${chainId}`);
  return keychain[chainId] as string;
};

const handleArgCallback = async ({
  tx,
  chainId,
  safeId,
  localABIs,
  appState,
  argCallbackRecord,
}: {
  tx: TXLego;
  chainId: ValidNetwork;
  safeId?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  argCallbackRecord: Record<string, ArgCallback>;
}) => {
  const callbackKey = tx.argCallback;
  if (callbackKey && argCallbackRecord[callbackKey]) {
    const callback = argCallbackRecord[callbackKey];
    return await callback({ tx, chainId, safeId, localABIs, appState });
  }
  throw new Error(`Could not find argCallback: ${callbackKey}`);
};

export const processArg = async ({
  arg,
  chainId,
  safeId,
  localABIs,
  appState,
  rpcs,
  explorerKeys,
}: {
  arg: ValidArgType;
  chainId: ValidNetwork;
  safeId?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  rpcs: Keychain;
  explorerKeys: Keychain;
}): Promise<ArgType> => {
  if (isSearchArg(arg)) {
    return searchArg({ appState, searchString: arg, shouldThrow: true });
  }
  if (arg?.type === 'static') {
    return arg.value;
  }
  if (arg?.type === 'template') {
    const fragments = arg.value.split(/{|}/g);
    return fragments
      .map((f: string) =>
        f[0] === '.'
          ? searchArg({ appState, searchString: f as StringSearch, shouldThrow: true })
          : f
      )
      .join('');
  }
  if (arg?.type === 'singleton') {
    return handleKeychainArg({ chainId, keychain: arg.keychain });
  }
  if (arg?.type === 'nestedArray') {
    return Promise.all(
      arg.args.map((a) => processArg({ arg: a, chainId, safeId, localABIs, appState, rpcs, explorerKeys }))
    );
  }
  if (arg?.type === 'multicall' || arg.type === 'encodeMulticall') {
    const actions = await handleMulticallArg({ arg, chainId, localABIs, appState, rpcs, explorerKeys });
    return handleEncodeMulticallArg({ arg, actions });
  }
  if (arg?.type === 'encodeCall') {
    return handleEncodeCallArg({ arg, chainId, localABIs, appState, rpcs, explorerKeys });
  }
  if (arg?.type === 'argEncode') {
    return handleArgEncode({ arg, chainId, safeId, localABIs, appState, rpcs, explorerKeys });
  }
  if (arg?.type === 'estimateGas') {
    return handleGasEstimate({ arg, chainId, safeId, localABIs, appState, rpcs, explorerKeys });
  }
  if (arg?.type === 'proposalExpiry') {
    if (arg.search) {
      const result = searchArg({ appState, searchString: arg.search, shouldThrow: false });
      return typeof result === 'number' ? calcExpiry(result) : calcExpiry(arg.fallback);
    }
    return calcExpiry(arg.fallback);
  }
  if (arg?.type === 'JSONDetails') {
    return handleDetailsJSON({ arg, chainId, safeId, localABIs, appState, rpcs, explorerKeys });
  }
  console.log('**DEBUG** arg', arg);
  throw new Error(`ArgType not found.`);
};

export const processArgs = async ({
  tx,
  chainId,
  safeId,
  localABIs,
  appState,
  argCallbackRecord,
  rpcs,
  explorerKeys,
}: {
  tx: TXLego;
  chainId: ValidNetwork;
  safeId?: string;
  localABIs: Record<string, ABI>;
  appState: ArbitraryState;
  argCallbackRecord: Record<string, ArgCallback>;
  rpcs: Keychain;
  explorerKeys: Keychain;
}) => {
  const { argCallback, args, staticArgs } = tx;

  if (staticArgs) return staticArgs;
  if (argCallback) {
    return handleArgCallback({ tx, chainId, safeId, localABIs, appState, argCallbackRecord });
  }
  if (args) {
    return await Promise.all(
      args.map((arg) => processArg({ arg, chainId, safeId, localABIs, appState, rpcs, explorerKeys }))
    );
  }
  throw new Error(
    'TX Lego must have a valid arg type: use a string alias for an argument callback or an array of valid arguments'
  );
};
