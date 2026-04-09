export const QueryErrors: Record<string, string> = {
  SUBGRAPH_ERROR: 'Subgraph request error',
  UNSUPPORTED_NETWORK: 'Unsupported network',
  GNOSIS_ERROR: 'Gnosis api request error',
  INVALID_NETWORK_ERROR: 'Invalid network',
  REQUEST_ERROR: 'Request error',
};

export type FetchError = {
  type: string;
  message: string;
  errorObject?: unknown;
};

export const formatFetchError = ({
  type,
  errorObject,
}: {
  type: string;
  errorObject?: unknown;
}): FetchError => ({
  type,
  errorObject,
  message: QueryErrors[type] ?? 'Unknown error',
});
