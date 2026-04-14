import { useQueryClient } from '@tanstack/react-query';

import { FormBuilder } from '@/lib/form-builder';
import { COMMON_FORMS } from '@/lib/legos';
import { useCurrentDao } from '@/app/hooks/useCurrentDao';
import { AppFieldLookup } from '@/lib/legos/config';

type ManageTokensProps = {
  daoChain: string;
  daoId: string;
};

export const ManageTokens = ({ daoChain }: ManageTokensProps) => {
  const { daoChain: ctxChain } = useCurrentDao();
  const queryClient = useQueryClient();

  const onFormComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['list-members'] });
    queryClient.invalidateQueries({ queryKey: ['get-member'] });
  };

  return (
    <FormBuilder
      form={COMMON_FORMS.MANAGE_TOKENS}
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
