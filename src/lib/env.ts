const REQUIRED_ENV_VARS = [
  'VITE_WALLET_CONNECT_ID',
  'VITE_GRAPH_API_KEY',
  'VITE_ALCHEMY_KEY',
  'VITE_ETHERSCAN_KEY',
  'VITE_GNOSIS_SAFE_API_KEY',
] as const;

export const getMissingEnvVars = (): string[] =>
  REQUIRED_ENV_VARS.filter((key) => !import.meta.env[key]);

export const env = {
  graphApiKey: import.meta.env.VITE_GRAPH_API_KEY as string,
  walletConnectId: import.meta.env.VITE_WALLET_CONNECT_ID as string,
  alchemyKey: import.meta.env.VITE_ALCHEMY_KEY as string,
  etherscanKey: import.meta.env.VITE_ETHERSCAN_KEY as string,
  gnosisSafeApiKey: import.meta.env.VITE_GNOSIS_SAFE_API_KEY as string,
  sequenceKey: import.meta.env.VITE_SEQUENCE_KEY as string | undefined,
};
