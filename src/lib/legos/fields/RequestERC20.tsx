import { useEffect, useMemo } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import {
  handleBaseUnits, ignoreEmptyVal, toWholeUnits, truncValue, ValidateField,
} from '@/lib/utils';
import { isValidNetwork } from '@/lib/keychain-utils';
import { useDaoTokenBalances } from '@/lib/dao-hooks';
import { Buildable, Button, WrappedInputSelect } from '@/lib/ui';
import { useDaoData } from '@/features/dao/hooks/useDaoData';
import { useCurrentDao } from '@/app/hooks/useCurrentDao';
import { getErc20s } from './fieldHelpers';

export const RequestERC20 = (
  props: Buildable<{ amtId?: string; addressId?: string; safeAddressId?: string }>
) => {
  const { daoChain } = useCurrentDao();
  const { amtId = 'paymentTokenAmt', addressId = 'paymentTokenAddress', safeAddressId = 'safeAddress' } = props;
  const { dao } = useDaoData();
  const { watch, setValue } = useFormContext();

  const paymentTokenAddr = watch(addressId);
  const safeAddress = watch(safeAddressId);
  const selectedSafeAddress = safeAddress || dao?.safeAddress;
  const { tokens } = useDaoTokenBalances({
    chainid: daoChain,
    safeAddress: selectedSafeAddress,
  });

  useEffect(() => {
    if (paymentTokenAddr) setValue(amtId, '0');
  }, [paymentTokenAddr, setValue, amtId]);

  const erc20s = useMemo(() => {
    if (tokens && isValidNetwork(daoChain)) {
      return getErc20s({ tokenBalances: tokens });
    }
    return null;
  }, [tokens, daoChain]);

  const selectOptions = useMemo(() => {
    if (!erc20s) return;
    return erc20s.map((token) => ({ name: token.symbol, value: token.address }));
  }, [erc20s]);

  const selectedToken = useMemo(() => {
    if (!erc20s || !paymentTokenAddr) return;
    return erc20s.find(({ address }) => address === paymentTokenAddr);
  }, [paymentTokenAddr, erc20s]);

  const displayBalance = useMemo(() => {
    if (!selectedToken || BigInt(selectedToken.daoBalance) === BigInt(0)) return '0';
    return truncValue(toWholeUnits(selectedToken.daoBalance, selectedToken.decimals), 6);
  }, [selectedToken]);

  const setMax = () => {
    if (!selectedToken) return;
    setValue(amtId, toWholeUnits(selectedToken?.daoBalance || '0', selectedToken?.decimals));
  };

  const newRules: RegisterOptions = {
    setValueAs: (value) => handleBaseUnits(value, selectedToken?.decimals),
    validate: {
      number: (value) => ignoreEmptyVal(value, ValidateField.number),
      daoHasBalance: (val) =>
        selectedToken &&
        ignoreEmptyVal(val, (val: any) =>
          Number(val) > Number(selectedToken?.daoBalance || 0)
            ? 'Amount exceeds DAO Balance'
            : true
        ),
    },
    ...props.rules,
  };

  return (
    <WrappedInputSelect
      {...props}
      id={amtId}
      defaultValue="0"
      selectId={addressId}
      selectPlaceholder="--"
      options={selectOptions || []}
      rightAddon={
        <Button color="secondary" size="sm" onClick={setMax}>
          Max: {displayBalance}
        </Button>
      }
      rules={newRules}
    />
  );
};
