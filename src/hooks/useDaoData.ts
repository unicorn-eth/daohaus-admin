import { useCurrentDao } from '@/hooks/useCurrentDao';
import { useDao } from '@/lib/dao-hooks';

/**
 * Compat wrapper for @daohaus/moloch-v3-hooks `useDaoData`.
 * Returns { dao } where dao is the DaoItem from the current DAO context.
 */
export const useDaoData = () => {
  const { daoChain, daoId } = useCurrentDao();
  return useDao({ chainid: daoChain, daoid: daoId });
};
