import { useQueryClient } from '@tanstack/react-query';

import { FormBuilder } from '@/lib/form-builder';
import { COMMON_FORMS } from '@/lib/legos';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { AppFieldLookup } from '@/legos/legoConfig';

export const AddSafeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { daoChain } = useCurrentDao();
  const queryClient = useQueryClient();

  const onFormComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['get-dao'] });
    onSuccess();
  };

  return (
    <FormBuilder
      form={COMMON_FORMS.ADD_SAFE}
      customFields={AppFieldLookup}
      lifeCycleFns={{
        onPollSuccess: () => {
          onFormComplete();
        },
      }}
      targetNetwork={daoChain}
    />
  );
};
