import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { SingleColumnLayout } from '@/lib/ui';
import { FormBuilder } from '@/lib/form-builder';
import { COMMON_FORMS } from '@/lib/legos';
import { useCurrentDao } from '@/app/hooks/useCurrentDao';
import { useDao } from '@/lib/dao-hooks';
import type { DaoItem } from '@/lib/dao-hooks';
import { AppFieldLookup } from '@/lib/legos/config';

const formatDaoProfileForForm = (dao: DaoItem) => {
  const links = dao.profile?.links ?? [];

  return {
    name: dao.name,
    icon: dao.profile?.avatarImg,
    tags: dao.profile?.tags?.join(', '),
    description: dao.profile?.description,
    long_description: dao.profile?.longDescription,
    discord: links.find((l) => l.label === 'Discord')?.url,
    github: links.find((l) => l.label === 'Github')?.url,
    telegram: links.find((l) => l.label === 'Telegram')?.url,
    twitter: links.find((l) => l.label === 'Twitter')?.url,
    blog: links.find((l) => l.label === 'Blog')?.url,
    web: links.find((l) => l.label === 'Web')?.url,
    custom1: links[6]?.url,
    custom1Label: links[6]?.label,
    custom2: links[7]?.url,
    custom2Label: links[7]?.label,
    custom3: links[8]?.url,
    custom3Label: links[8]?.label,
  };
};

export const UpdateSettings = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { dao } = useDao({ chainid: daoChain, daoid: daoId });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const defaultFields = useMemo(
    () => (dao ? formatDaoProfileForForm(dao) : undefined),
    [dao]
  );

  const onFormComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['get-dao'] });
    navigate(`/molochv3/${daoChain}/${daoId}/settings`);
  };

  if (!dao) return null;

  return (
    <SingleColumnLayout>
      <FormBuilder
        defaultValues={defaultFields}
        form={COMMON_FORMS.METADATA_SETTINGS}
        customFields={AppFieldLookup}
        targetNetwork={daoChain}
        lifeCycleFns={{
          onPollSuccess: () => {
            onFormComplete();
          },
        }}
      />
    </SingleColumnLayout>
  );
};
