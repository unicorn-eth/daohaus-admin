import { ABI_EXPLORER_KEYS, ENDPOINTS } from './endpoints';
import { Keychain, ValidNetwork } from './types';

export const generateExplorerLink = ({
  chainId,
  address,
  type = 'address',
}: {
  chainId: ValidNetwork;
  address?: string;
  type?: string;
}) => `${ENDPOINTS.EXPLORER[chainId]}/${type}/${address || ''}`;

const CHAIN_ID_DECIMAL: Keychain<number> = {
  '0x1': 1,
  '0x64': 100,
  '0x89': 137,
  '0xa': 10,
  '0xa4b1': 42161,
  '0xaa36a7': 11155111,
  '0x2105': 8453,
};

export const getABIUrl = ({
  chainId,
  contractAddress,
  explorerKeys = ABI_EXPLORER_KEYS,
}: {
  chainId: ValidNetwork;
  contractAddress: string;
  explorerKeys?: Keychain;
}) => {
  const decimalChainId = CHAIN_ID_DECIMAL[chainId];
  if (!decimalChainId) return undefined;
  const apiKey = explorerKeys['0x1']; // single Etherscan v2 key works for all chains
  return `https://api.etherscan.io/v2/api?chainid=${decimalChainId}&module=contract&action=getabi&address=${contractAddress}${apiKey ? `&apikey=${apiKey}` : ''}`;
};
