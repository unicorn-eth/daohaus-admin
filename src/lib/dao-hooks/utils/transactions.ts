import { GraphQLClient } from 'graphql-request';

import { GRAPH_API_KEYS, ValidNetwork } from '@/lib/keychain-utils';
import type { IFindQueryResult } from '@/lib/data-fetch-utils';
import { formatFetchError } from '@/lib/data-fetch-utils';

import { FIND_TX } from './queries';
import { getGraphUrl } from './endpoints';

export type FindTxResult = {
  transaction: {
    id: string;
    createdAt: string;
    daoAddress: string;
  } | null;
};

export const findTransaction = async ({
  chainId,
  txHash,
  graphKey = GRAPH_API_KEYS[chainId] ?? '',
}: {
  chainId: ValidNetwork;
  txHash: string;
  graphKey?: string;
}): Promise<IFindQueryResult<FindTxResult>> => {
  const url = getGraphUrl({ chainid: chainId, graphKey, subgraphKey: 'DAOHAUS' });

  if (!url || !graphKey) {
    return { error: formatFetchError({ type: 'INVALID_NETWORK_ERROR' }) };
  }

  try {
    const client = new GraphQLClient(url);
    const data = await client.request<FindTxResult>(FIND_TX, { id: txHash });
    return { data };
  } catch (err) {
    return { error: formatFetchError({ type: 'SUBGRAPH_ERROR', errorObject: err }) };
  }
};
