import { ENDPOINTS, ValidNetwork } from '@/lib/keychain-utils';

export const generateGnosisUiLink = ({
  chainId,
  address,
}: {
  chainId: ValidNetwork;
  address?: string;
}) => `${ENDPOINTS['GNOSIS_SAFE_UI'][chainId]}:${address}/balances`;
