import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { FormBuilder } from '@/lib/form-builder';
import { COMMON_FORMS } from '@/lib/legos';
import { useConnectedMember } from '@/hooks/useConnectedMember';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { AppFieldLookup } from '@/legos/legoConfig';

type ManageDelegateProps = {
  daoChain: string;
  daoId: string;
  /** Pre-fill the delegate address (used when delegating TO another member) */
  defaultMember?: string;
};

export const ManageDelegate = ({
  daoChain,
  defaultMember,
}: ManageDelegateProps) => {
  const { connectedMember } = useConnectedMember();
  const { daoChain: ctxChain, daoId: ctxDaoId } = useCurrentDao();
  const queryClient = useQueryClient();

  const defaultValues = useMemo(() => {
    if (defaultMember) {
      return { delegatingTo: defaultMember };
    }
    if (
      connectedMember &&
      connectedMember.delegatingTo !== connectedMember.memberAddress
    ) {
      return { delegatingTo: connectedMember.delegatingTo };
    }
    return undefined;
  }, [connectedMember, defaultMember]);

  const onFormComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['list-members'] });
    queryClient.invalidateQueries({ queryKey: ['get-member'] });
  };

  return (
    <FormBuilder
      defaultValues={defaultValues}
      form={COMMON_FORMS.MANAGE_DELEGATE}
      customFields={AppFieldLookup}
      lifeCycleFns={{
        onPollSuccess: () => {
          onFormComplete();
        },
      }}
      targetNetwork={daoChain || ctxChain}
    />
  );
};
