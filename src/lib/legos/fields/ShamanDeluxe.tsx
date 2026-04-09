import { ComponentProps, useMemo } from 'react';
import styled from 'styled-components';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import { ignoreEmptyVal, isNumberish, SHAMAN_PERMISSIONS } from '@/lib/utils';
import { Buildable, DataSm, ShamanPermission } from '@/lib/ui';
import { useDaoData } from '@/hooks/useDaoData';

const Secondary = styled.span`
  color: ${(props) => props.theme.secondary.step9};
`;

const DeluxeBox = styled.div`
  p {
    margin-bottom: 1.2rem;
  }
`;

export const ShamanDeluxe = (
  props: Buildable<
    ComponentProps<typeof ShamanPermission> & { watchAddressField?: string }
  >
) => {
  const { id = 'shamanPermission', watchAddressField = 'shamanAddress' } = props;
  const { watch } = useFormContext();
  const { dao } = useDaoData();

  const [shamanPermission, shamanAddress] = watch([id, watchAddressField]);

  const oldShamanLevel = useMemo(() => {
    if (!dao || !shamanPermission || !shamanAddress) return;
    return dao?.shamen?.find((shaman) => shaman.shamanAddress === shamanAddress)?.permissions;
  }, [dao, shamanPermission, shamanAddress]);

  const newRules: RegisterOptions = {
    validate: (val) =>
      ignoreEmptyVal(val, (val: any) => {
        if (oldShamanLevel == null) return true;
        return Number(oldShamanLevel) > Number(val)
          ? true
          : 'Shaman permission level can only go down';
      }),
    ...props.rules,
  };

  return (
    <DeluxeBox>
      {oldShamanLevel != null && (
        <DataSm>
          Current Shaman Level: <Secondary>{SHAMAN_PERMISSIONS[Number(oldShamanLevel)]}</Secondary>
        </DataSm>
      )}
      <ShamanPermission {...props} id={id} rules={newRules} />
    </DeluxeBox>
  );
};
