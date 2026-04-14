import { useEnsAvatar, useEnsName } from 'wagmi';
import type { AccountProfile } from '@/lib/utils';

/**
 * Resolves ENS name and avatar for an address.
 * ENS always resolves on mainnet (chainId: 1) regardless of the DAO's chain.
 * Falls back to truncated address when no ENS name is found.
 */
export const useProfile = (address: string): AccountProfile => {
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: 1,
  });

  return {
    address,
    ens: ensName ?? undefined,
    avatar: ensAvatar ?? null,
  };
};
