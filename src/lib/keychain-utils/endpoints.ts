import { Keychain, KeychainList, ValidNetwork } from './types';

export const ENDPOINTS: KeychainList = {
  V3_SUBGRAPH: {
    '0x1':
      'https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/HouDe2pTdyKM9CTG1aodnPPPhm7U148BCH7eJ4HHwpdQ',
    '0x64':
      'https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/6x9FK3iuhVFaH9sZ39m8bKB5eckax8sjxooBPNKWWK8r',
    '0x89':
      'https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/A4su27JYXR5TkPZmiFHzzqMJnmYttfU3FyrdNBDnnu8T',
    '0xa':
      'https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/CgH5vtz9CJPdcSmD3XEh8fCVDjQjnRwrSawg71T1ySXW',
    '0xa4b1':
      'https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/GPACxuMWrrPSEJpFqupnePJNMfuArpFabrXLnWvXU2bp',
    '0xaa36a7':
      'https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/3k93SNY5Y1r4YYWEuPY9mpCm2wnGoYDKRtk82QZJ3Kvw',
    '0x2105':
      'https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/7yh4eHJ4qpHEiLPAk9BXhL5YgYrTrRE6gWy8x4oHyAqW',
  },
  EXPLORER: {
    '0x1': 'https://etherscan.io',
    '0x64': 'https://gnosisscan.io',
    '0x89': 'https://polygonscan.com',
    '0xa': 'https://optimistic.etherscan.io',
    '0xa4b1': 'https://arbiscan.io',
    '0xaa36a7': 'https://sepolia.etherscan.io',
    '0x2105': 'https://basescan.org',
  },
  GNOSIS_API: {
    '0x1': 'https://safe-transaction-mainnet.safe.global/api/v1',
    '0x64': 'https://safe-transaction-gnosis-chain.safe.global/api/v1',
    '0x89': 'https://safe-transaction-polygon.safe.global/api/v1',
    '0xa': 'https://safe-transaction-optimism.safe.global/api/v1',
    '0xa4b1': 'https://safe-transaction-arbitrum.safe.global/api/v1',
    '0xaa36a7': 'https://safe-transaction-sepolia.safe.global/api/v1',
    '0x2105': 'https://safe-transaction-base.safe.global/api/v1',
  },
  GNOSIS_SAFE_UI: {
    '0x1': 'https://app.safe.global/eth',
    '0x64': 'https://app.safe.global/gno',
    '0x89': 'https://app.safe.global/matic',
    '0xa': 'https://app.safe.global/oeth',
    '0xa4b1': 'https://app.safe.global/arb',
    '0xaa36a7': 'https://app.safe.global/sep',
    '0x2105': 'https://app.safe.global/base',
  },
  SEQUENCE_API: {
    '0x1': 'https://mainnet-indexer.sequence.app',
    '0x64': 'https://gnosis-indexer.sequence.app',
    '0x89': 'https://polygon-indexer.sequence.app',
    '0xa': 'https://optimism-indexer.sequence.app',
    '0xa4b1': 'https://arbitrum-indexer.sequence.app',
    '0xaa36a7': 'https://sepolia-indexer.sequence.app',
    '0x2105': 'https://base-indexer.sequence.app',
  },
};

export const addApiKeyToGraphEnpoints = (
  graphApiKeys: Keychain,
  endpoints: KeychainList,
): KeychainList => {
  return Object.keys(graphApiKeys).reduce((acc, key) => {
    if (endpoints['V3_SUBGRAPH'][key as keyof Keychain] && acc) {
      const unreplacedValue = acc['V3_SUBGRAPH'][key as keyof Keychain];
      const apiKey = graphApiKeys[key as keyof Keychain];
      if (unreplacedValue && apiKey) {
        acc['V3_SUBGRAPH'][key as keyof Keychain] = unreplacedValue.replace(
          '[api-key]',
          apiKey,
        );
      }
    }
    return acc;
  }, endpoints);
};
export const getGraphUrl = (
  networkId: ValidNetwork,
  graphApiKeys?: Keychain,
): string | undefined => {
  if (graphApiKeys) {
    const endpoints = addApiKeyToGraphEnpoints(graphApiKeys, ENDPOINTS);
    return endpoints['V3_SUBGRAPH'][networkId];
  }
  return ENDPOINTS['V3_SUBGRAPH'][networkId];
};
const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY as string | undefined;

export const HAUS_RPC_DEFAULTS = {
  '0x1': ALCHEMY_KEY
    ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : 'https://cloudflare-eth.com',
  '0x64': 'https://rpc.gnosischain.com/',
  '0xa': ALCHEMY_KEY
    ? `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : 'https://mainnet.optimism.io',
  '0x89': ALCHEMY_KEY
    ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : 'https://polygon-rpc.com/',
  '0xa4b1': ALCHEMY_KEY
    ? `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : 'https://arb1.arbitrum.io/rpc',
  '0xaa36a7': ALCHEMY_KEY
    ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : 'https://rpc.sepolia.org',
  '0x2105': ALCHEMY_KEY
    ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : 'https://mainnet.base.org',
};
export const HAUS_RPC = { ...HAUS_RPC_DEFAULTS };
export const GRAPH_API_KEYS = {
  '0x1': import.meta.env.VITE_GRAPH_API_KEY as string | undefined,
  '0x64': import.meta.env.VITE_GRAPH_API_KEY as string | undefined,
  '0xaa36a7': import.meta.env.VITE_GRAPH_API_KEY as string | undefined,
  '0x2105': import.meta.env.VITE_GRAPH_API_KEY as string | undefined,
  '0xa4b1': import.meta.env.VITE_GRAPH_API_KEY as string | undefined,
  '0x89': import.meta.env.VITE_GRAPH_API_KEY as string | undefined,
  '0xa': import.meta.env.VITE_GRAPH_API_KEY as string | undefined,
};

// Etherscan v2 uses a single API key across all chains
const ETHERSCAN_KEY = import.meta.env.VITE_ETHERSCAN_KEY as string | undefined;
export const ABI_EXPLORER_KEYS: Keychain = {
  '0x1': ETHERSCAN_KEY,
  '0x64': ETHERSCAN_KEY,
  '0x89': ETHERSCAN_KEY,
  '0xa': ETHERSCAN_KEY,
  '0xa4b1': ETHERSCAN_KEY,
  '0xaa36a7': ETHERSCAN_KEY,
  '0x2105': ETHERSCAN_KEY,
};
