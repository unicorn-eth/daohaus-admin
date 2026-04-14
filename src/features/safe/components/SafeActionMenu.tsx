import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MoreHorizontal } from 'lucide-react';
import { useAccount } from 'wagmi';

import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLinkStyles,
  Button,
} from '@/lib/ui';
import { getNetwork } from '@/lib/keychain-utils';

const MenuLink = styled(Link)`
  ${DropdownLinkStyles}
  display: block;
  width: 100%;
`;

const MenuTrigger = styled(Button)``;

type SafeActionMenuProps = {
  ragequittable: boolean;
  safeAddress: string;
  daoChain: string;
  daoId: string;
};

export const SafeActionMenu = ({
  ragequittable,
  safeAddress,
  daoChain,
  daoId,
}: SafeActionMenuProps) => {
  const { address } = useAccount();

  const networkSymbol = useMemo(
    () => getNetwork(daoChain)?.symbol ?? 'ETH',
    [daoChain]
  );

  if (!address) return null;

  const sidecarParams = `&defaultValues=${encodeURIComponent(JSON.stringify({ safeAddress }))}`;

  const erc20Path = `/molochv3/${daoChain}/${daoId}/new-proposal?formLego=${
    ragequittable ? 'TRANSFER_ERC20' : `TRANSFER_ERC20_SIDECAR${sidecarParams}`
  }`;
  const nativePath = `/molochv3/${daoChain}/${daoId}/new-proposal?formLego=${
    ragequittable
      ? 'TRANSFER_NETWORK_TOKEN'
      : `TRANSFER_NETWORK_TOKEN_SIDECAR${sidecarParams}`
  }`;
  const multicallPath = `/molochv3/${daoChain}/${daoId}/new-proposal?formLego=${
    ragequittable ? 'MULTICALL' : `MULTICALL_SIDECAR${sidecarParams}`
  }`;

  return (
    <DropdownMenu>
      <DropdownTrigger asChild>
        <MenuTrigger IconLeft={MoreHorizontal} size="sm" variant="ghost" color="secondary" />
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem asChild>
          <MenuLink to={erc20Path}>Transfer ERC-20</MenuLink>
        </DropdownItem>
        <DropdownItem asChild>
          <MenuLink to={nativePath}>Transfer {networkSymbol}</MenuLink>
        </DropdownItem>
        <DropdownItem asChild>
          <MenuLink to={multicallPath}>Tx Builder</MenuLink>
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
};
