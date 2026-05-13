import { AddressDisplay, DataSm, Divider } from '@/lib/ui';
import { isEthAddress, isNumberish, ArgType } from '@/lib/utils';
import type { ValidNetwork } from '@/lib/keychain-utils';

export const ValueDisplay = ({
  argValue,
  argType,
  network,
  isMobile,
}: {
  argValue: ArgType;
  argType?: string;
  network?: ValidNetwork;
  isMobile?: boolean;
}) => {
  if (Array.isArray(argValue)) {
    const displayValue =
      argType === 'tuple'
        ? Object.entries(Object.assign({}, argValue)).filter(
            (entry) => !isNumberish(entry[0])
          )
        : argValue;
    return (
      <>
        {displayValue.map((value, index) => (
          <div className="space" key={`argValue${index}`}>
            <ValueDisplay
              argValue={Array.isArray(value) ? `${value[0]}: ${value[1]}` : value as ArgType}
              argType={argType}
              network={network}
            />
            {index + 1 < argValue?.length && <Divider />}
          </div>
        ))}
      </>
    );
  }
  if (isEthAddress(argValue)) {
    return (
      <AddressDisplay
        address={argValue}
        copy
        explorerNetworkId={network}
        className="space"
        truncate={isMobile}
      />
    );
  }
  if (typeof argValue === 'boolean') {
    return <DataSm className="space">{`${argValue}`}</DataSm>;
  }
  if (typeof argValue === 'string' || typeof argValue === 'number') {
    return <DataSm className="space">{argValue}</DataSm>;
  }
  return <DataSm className="space">{String(argValue)}</DataSm>;
};
