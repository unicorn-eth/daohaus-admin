import { LOCAL_ABI } from '@/lib/abis';
import { encodeFunction } from '@/lib/utils';
import { CONTRACT_KEYCHAINS, ValidNetwork } from '@/lib/keychain-utils';
import {
  hashMessage,
  hashTypedData,
  hexToString,
  isHex,
} from 'viem';

type BigIntish = string | number | bigint;
type BytesLike = string | Uint8Array;

type EIP712TypedData = {
  domain: {
    name?: string;
    version?: string;
    chainId?: BigIntish;
    verifyingContract?: string;
    salt?: BytesLike;
  };
  types: {
    [key: string]: {
      name: string;
      type: string;
    }[];
  };
  message: Record<string, unknown>;
};

export const WalletConnectVersion = {
  NONE: 0,
  V1: 1,
  V2: 2,
} as const;

export type WalletConnectVersion =
  (typeof WalletConnectVersion)[keyof typeof WalletConnectVersion];

// WalletConnect URI follows eip-1328 standard
export const getWalletConnectVersion = (uri: string): WalletConnectVersion => {
  const encodedURI = encodeURI(uri);
  return encodedURI?.split('@')?.[1]?.[0] === '1'
    ? WalletConnectVersion.V1
    : WalletConnectVersion.V2;
};

export const isObjectEIP712TypedData = (
  obj?: unknown
): obj is EIP712TypedData => {
  return (
    typeof obj === 'object' &&
    obj != null &&
    'domain' in obj &&
    'types' in obj &&
    'message' in obj
  );
};

const getDecodedMessage = (message: string): string => {
  if (isHex(message)) {
    try {
      return hexToString(message as `0x${string}`);
    } catch (e) {
      // not UTF8 — return raw
    }
  }
  return message;
};

export const encodeSafeSignMessage = (
  chainId: ValidNetwork,
  message: string | EIP712TypedData
) => {
  const signLibAddress = CONTRACT_KEYCHAINS.GNOSIS_SIGNLIB[chainId];

  const signedTypedMessage = (message: string | EIP712TypedData): string => {
    if (isObjectEIP712TypedData(message)) {
      const typesCopy = { ...message.types } as Record<string, { name: string; type: string }[]>;
      delete typesCopy.EIP712Domain;
      // primaryType is the first non-domain type key
      const primaryType = Object.keys(typesCopy)[0];
      return hashTypedData({
        domain: message.domain as Parameters<typeof hashTypedData>[0]['domain'],
        types: typesCopy as Parameters<typeof hashTypedData>[0]['types'],
        primaryType,
        message: message.message,
      }) as string;
    }
    return hashMessage(getDecodedMessage(message)) as string;
  };

  const msgHash = signedTypedMessage(message);
  const data = encodeFunction(LOCAL_ABI.GNOSIS_SIGNLIB, 'signMessage', [msgHash]);

  if (signLibAddress && typeof data === 'string') {
    return {
      to: signLibAddress,
      data,
      value: '0',
      operation: '1',
    };
  }
  return undefined;
};

export type Tx = {
  data: string;
  from?: string;
  gas?: string;
  to: string;
  value: string;
  operation?: string;
};

export type WCPayload = {
  id: number;
  jsonrpc: string;
  method: string;
  params: Array<Tx>;
};

export type WCParams = {
  chainId: ValidNetwork;
  safeAddress: string;
  uri: string;
};
