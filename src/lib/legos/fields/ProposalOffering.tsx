import { useEffect, useState } from 'react';
import { fromWei } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

import { isValidNetwork, HAUS_NETWORK_DATA } from '@/lib/keychain-utils';
import { useConnectedMember } from '@/hooks/useConnectedMember';
import { useDaoData } from '@/hooks/useDaoData';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { Buildable, ParMd, TintSecondary } from '@/lib/ui';

export const ProposalOffering = (props: Buildable<{ id?: string }>) => {
  const { id = 'proposalOffering' } = props;
  const { daoChain } = useCurrentDao();
  const { dao } = useDaoData();
  const { connectedMember } = useConnectedMember();
  const { register, setValue } = useFormContext();
  const [requiresOffering, setRequiresOffering] = useState(false);

  const networkTokenSymbol =
    isValidNetwork(daoChain) ? HAUS_NETWORK_DATA[daoChain]?.symbol : undefined;

  register(id);

  useEffect(() => {
    if (!dao || !id) return;

    if (
      !connectedMember ||
      Number(dao.sponsorThreshold) > Number(connectedMember.delegateShares)
    ) {
      setRequiresOffering(true);
      setValue(id, dao.proposalOffering);
      return;
    }

    setValue(id, '0');
    setRequiresOffering(false);
  }, [dao, connectedMember, setValue, id]);

  if (!requiresOffering || !dao?.proposalOffering || !networkTokenSymbol)
    return null;

  return (
    <ParMd>
      Proposal Offering:{' '}
      <TintSecondary>
        {fromWei(dao.proposalOffering)} {networkTokenSymbol}
      </TintSecondary>
    </ParMd>
  );
};
