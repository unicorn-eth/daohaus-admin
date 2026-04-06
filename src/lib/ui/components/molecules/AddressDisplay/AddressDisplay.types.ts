import { Keychain } from '@/lib/keychain-utils';

export type AddressDisplayProps = {
  address: string;
  explorerNetworkId?: keyof Keychain;
  copy?: boolean;
  truncate?: boolean;
  txHash?: boolean;
  textOverride?: string;
  className?: string;
};
