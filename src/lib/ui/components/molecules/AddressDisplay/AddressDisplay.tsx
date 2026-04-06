import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { Copy } from 'lucide-react';

import { generateExplorerLink } from '@/lib/keychain-utils';
import { truncateAddress } from '@/lib/utils';

import { useCopyToClipboard } from '../../../hooks';
import { Icon, Link } from '../../atoms';
import { AddressDisplayProps } from './AddressDisplay.types';
import {
  AddressContainer,
  AddressCopyIcon,
  AddressDataSm,
} from './AddressDisplay.styles';

// ! Where the rest of the props go?
export const AddressDisplay = ({
  address,
  explorerNetworkId,
  copy,
  truncate,
  txHash,
  textOverride,
  className,

}: AddressDisplayProps) => {
  const theme = useTheme();
  const copyToClipboard = useCopyToClipboard();

  const explorerLink = useMemo(() => {
    if (explorerNetworkId) {
      return generateExplorerLink({
        chainId: explorerNetworkId,
        address,
        type: txHash ? 'tx' : 'address',
      });
    }
  }, [address, txHash, explorerNetworkId]);

  const handleCopy = () => {
    copyToClipboard(
      address,
      `Success ${txHash ? 'Transaction Hash:' : 'Address:'}`
    );
  };

  const displayAddress = truncate ? truncateAddress(address) : address;

  return (
    <AddressContainer className={className}>
      <AddressDataSm>
        {textOverride ? textOverride : displayAddress}
      </AddressDataSm>
      {copy && (
        <AddressCopyIcon>
          <Icon>
            <Copy
              size="1.5rem"
              color={theme.addressDisplay.icon.color}
              onClick={handleCopy}
            />
          </Icon>
        </AddressCopyIcon>
      )}
      {explorerLink && <Link href={explorerLink}></Link>}
    </AddressContainer>
  );
};
