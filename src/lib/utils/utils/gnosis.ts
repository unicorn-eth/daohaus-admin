import { ENDPOINTS, ValidNetwork } from '@/lib/keychain-utils';

export const generateGnosisUiLink = ({
  chainId,
  address,
}: {
  chainId: ValidNetwork;
  address?: string;
}) => {
  const safeUiPath = ENDPOINTS['GNOSIS_SAFE_UI'][chainId];
  if (!safeUiPath) return '';

  const networkPrefix = safeUiPath.split('/').pop();
  const baseUrl = safeUiPath.replace(`/${networkPrefix}`, '');

  if (!address || !networkPrefix) return `${baseUrl}/balances`;

  return `${baseUrl}/balances?safe=${networkPrefix}:${address}`;
};
