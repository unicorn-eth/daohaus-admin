import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { SingleColumnLayout } from '@/lib/ui';
import { FormBuilder } from '@/lib/form-builder';
import { getFormLegoById } from '@/lib/legos';
import { useCurrentDao } from '@/hooks/useCurrentDao';
import { AppFieldLookup } from '@/legos/legoConfig';

export const NewProposal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { daoChain, daoId } = useCurrentDao();
  const queryClient = useQueryClient();

  const formLego = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const legoId = params.get('formLego');
    if (!legoId) return null;
    return getFormLegoById(legoId) ?? null;
  }, [location.search]);

  const defaults = useMemo(() => {
    if (!formLego) return null;
    const params = new URLSearchParams(location.search);
    const defaultValues = params.get('defaultValues');
    if (!defaultValues) return null;
    try {
      return JSON.parse(defaultValues);
    } catch {
      return null;
    }
  }, [location.search, formLego]);

  const onFormComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['list-proposals'] });
    navigate(`/molochv3/${daoChain}/${daoId}/proposals`);
  };

  if (!formLego) return null;

  return (
    <SingleColumnLayout>
      <FormBuilder
        form={formLego}
        defaultValues={defaults ?? undefined}
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
