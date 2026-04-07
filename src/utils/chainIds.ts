// Maps wagmi numeric chain IDs to the hex chain IDs used in URLs and subgraph queries.
const CHAIN_ID_TO_HEX: Record<number, string> = {
  1: '0x1',
  100: '0x64',
  137: '0x89',
  10: '0xa',
  42161: '0xa4b1',
  11155111: '0xaa36a7',
  8453: '0x2105',
};

const HEX_TO_CHAIN_ID: Record<string, number> = Object.fromEntries(
  Object.entries(CHAIN_ID_TO_HEX).map(([num, hex]) => [hex, Number(num)]),
);

export const toHexChainId = (chainId: number): string | undefined =>
  CHAIN_ID_TO_HEX[chainId];

export const fromHexChainId = (hex: string): number | undefined =>
  HEX_TO_CHAIN_ID[hex.toLowerCase()];

export const SUPPORTED_HEX_CHAIN_IDS = Object.values(CHAIN_ID_TO_HEX);

export const isSupportedChain = (hex: string): boolean =>
  hex.toLowerCase() in HEX_TO_CHAIN_ID;

const HEX_TO_NETWORK_NAME: Record<string, string> = {
  '0x1': 'Ethereum',
  '0x64': 'Gnosis',
  '0x89': 'Polygon',
  '0xa': 'Optimism',
  '0xa4b1': 'Arbitrum',
  '0xaa36a7': 'Sepolia',
  '0x2105': 'Base',
};

export const getNetworkName = (hexChainId: string): string =>
  HEX_TO_NETWORK_NAME[hexChainId.toLowerCase()] ?? hexChainId;
