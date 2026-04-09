import { useMemo } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import { handleBaseUnits, toWholeUnits, truncValue } from '@/lib/utils';
import { Buildable, Button, WrappedInput } from '@/lib/ui';
import { isValidNetwork } from '@/lib/keychain-utils';
import { useDaoTokenBalances } from '@/lib/dao-hooks';
import { useDaoData } from '@/hooks/useDaoData';
import { useCurrentDao } from '@/hooks/useCurrentDao';

export const RequestNativeToken = (
  props: Buildable<{ amtId?: string; addressId?: string; safeAddressId?: string }>
) => {
  const { id = 'valueRequested', safeAddressId = 'safeAddress' } = props;
  const { daoChain } = useCurrentDao();
  const { watch, setValue } = useFormContext();
  const { dao } = useDaoData();

  const safeAddress = watch(safeAddressId);
  const selectedSafeAddress = safeAddress || dao?.safeAddress;
  const { tokens } = useDaoTokenBalances({
    chainid: daoChain,
    safeAddress: selectedSafeAddress,
  });

  const networkTokenData = useMemo(() => {
    if (!tokens || !isValidNetwork(daoChain)) return null;
    const nativeToken = tokens.find((token) => !token.token);
    if (!nativeToken) return null;

    return {
      daoBalance: nativeToken.balance,
      decimals: 18,
      symbol: nativeToken.token?.symbol,
      name: nativeToken.token?.name,
    };
  }, [tokens, daoChain]);

  const displayBalance = useMemo(() => {
    if (!networkTokenData || BigInt(networkTokenData.daoBalance) === BigInt(0)) return '0';
    return truncValue(toWholeUnits(networkTokenData.daoBalance, networkTokenData.decimals), 6);
  }, [networkTokenData]);

  const label = networkTokenData?.name
    ? `Request ${networkTokenData.name}`
    : `Request Network Token`;

  const setMax = () => {
    setValue(
      id,
      toWholeUnits(networkTokenData?.daoBalance || '0', networkTokenData?.decimals)
    );
  };

  const newRules: RegisterOptions = {
    setValueAs: (value) => handleBaseUnits(value, 18),
    ...props.rules,
  };

  return (
    <WrappedInput
      {...props}
      id={id}
      label={label}
      defaultValue="0"
      rightAddon={
        <Button color="secondary" size="sm" onClick={setMax}>
          Max: {displayBalance}
        </Button>
      }
      rules={newRules}
    />
  );
};
