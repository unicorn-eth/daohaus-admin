import { useMemo } from 'react';
import { Buildable, Field, WrappedSelect } from '@/lib/ui';
import { truncateAddress } from '@/lib/utils';
import { useDaoData } from '@/features/dao/hooks/useDaoData';

export const SafeSelect = (props: Buildable<Field>) => {
  const { dao } = useDaoData();

  const safeOptions = useMemo(() => {
    if (!dao) return null;
    return dao.vaults
      .filter((v) => !v.ragequittable)
      .map((v) => ({
        name: `${v.name} (${truncateAddress(v.safeAddress)})`,
        value: v.safeAddress,
      }));
  }, [dao]);

  if (!safeOptions) return null;

  return <WrappedSelect {...props} options={safeOptions} />;
};
