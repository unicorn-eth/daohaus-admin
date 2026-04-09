import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SingleColumnLayout, Loading, ParMd } from '@/lib/ui';
import { FormBuilder } from '@/lib/form-builder';
import { COMMON_FORMS } from '@/lib/legos';
import { sortTokensForRageQuit } from '@/lib/legos/fields/fieldHelpers';
import { NETWORK_TOKEN_ETH_ADDRESS } from '@/lib/utils';
import type { TokenBalance } from '@/lib/utils';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { useConnectedMember } from '@/hooks/useConnectedMember';
import { useDao } from '@/lib/dao-hooks';
import { AppFieldLookup } from '@/legos/legoConfig';

export const RageQuit = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { dao, isLoading } = useDao({ chainid: daoChain, daoid: daoId });
  const { connectedMember } = useConnectedMember();
  const queryClient = useQueryClient();

  const defaultFields = useMemo(() => {
    if (!connectedMember || !dao) return undefined;

    const treasury = dao.vaults.find((v) => dao.safeAddress === v.safeAddress);

    return {
      to: connectedMember.memberAddress,
      tokens:
        treasury &&
        sortTokensForRageQuit(
          (treasury.tokenBalances ?? [])
            .filter((token: TokenBalance) => Number(token.balance) > 0)
            .map(
              (token: TokenBalance) =>
                token.tokenAddress || NETWORK_TOKEN_ETH_ADDRESS
            )
        ),
    };
  }, [connectedMember, dao]);

  const onFormComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['get-dao'] });
    queryClient.invalidateQueries({ queryKey: ['list-members'] });
    queryClient.invalidateQueries({ queryKey: ['get-member'] });
  };

  if (isLoading) {
    return (
      <SingleColumnLayout>
        <Loading size={80} />
      </SingleColumnLayout>
    );
  }

  if (!dao || !connectedMember) {
    return (
      <SingleColumnLayout>
        <ParMd>Connect your wallet to rage quit.</ParMd>
      </SingleColumnLayout>
    );
  }

  return (
    <SingleColumnLayout>
      <FormBuilder
        defaultValues={defaultFields}
        form={COMMON_FORMS.RAGEQUIT}
        customFields={AppFieldLookup}
        lifeCycleFns={{
          onPollSuccess: () => {
            onFormComplete();
          },
        }}
        targetNetwork={daoChain}
      />
    </SingleColumnLayout>
  );
};
