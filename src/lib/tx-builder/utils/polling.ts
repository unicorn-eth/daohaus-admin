import { GRAPH_API_KEYS, ValidNetwork } from '@/lib/keychain-utils';
import { findTransaction, FindTxResult } from '@/lib/dao-hooks';
import type { IFindQueryResult } from '@/lib/data-fetch-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PollFetch = (...args: any) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PollTest = (result?: any) => boolean;

type Poll = ({
  poll,
  test,
  interval,
  variables,
  maxTries,
}: {
  poll: PollFetch;
  test: PollTest;
  interval?: number;
  variables: unknown;
  onPollStart?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPollSuccess?: (result: any) => void;
  onPollError?: (error: unknown) => void;
  onPollTimeout?: (error: unknown) => void;
  maxTries?: number;
}) => void;

export const pollLastTX: PollFetch = async ({
  chainId,
  txHash,
}: {
  chainId: ValidNetwork;
  txHash: string;
}) => {
  try {
    const graphKey = GRAPH_API_KEYS[chainId] ?? '';
    return await findTransaction({ chainId, txHash, graphKey });
  } catch (error) {
    console.error(error);
    return;
  }
};

export const testLastTX = (
  result: IFindQueryResult<FindTxResult> | undefined
) => {
  return Boolean(result?.data?.transaction);
};

export const standardGraphPoll: Poll = async ({
  poll,
  test,
  interval = 5000,
  variables,
  onPollSuccess,
  onPollError,
  onPollTimeout,
  onPollStart,
  maxTries = 12,
}) => {
  onPollStart?.();
  let count = 0;

  const pollId = setInterval(async () => {
    if (count < maxTries) {
      try {
        const result = await poll(variables);
        console.log('**POLL RESULT**', result);
        if (test(result)) {
          console.log('TEST PASSED');
          onPollSuccess?.(result);
          clearInterval(pollId);
          return result;
        }
        count += 1;
      } catch (error) {
        onPollError?.(error);
        clearInterval(pollId);
      }
    } else {
      onPollTimeout?.(
        new Error(
          'Transaction poll ran out of tries. There could be issues with the subgraph.'
        )
      );
    }
  }, interval);
};
