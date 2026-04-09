import { useAccount } from 'wagmi';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { useMember } from '@/lib/dao-hooks';

/**
 * Compat wrapper for @daohaus/moloch-v3-hooks `useConnectedMember`.
 * Returns { connectedMember } for the currently connected wallet in the current DAO context.
 */
export const useConnectedMember = () => {
  const { address } = useAccount();
  const { daoChain, daoId } = useCurrentDao();
  const { member, ...rest } = useMember({
    chainid: daoChain,
    daoid: daoId,
    memberaddress: address?.toLowerCase(),
  });
  return { connectedMember: member, ...rest };
};
