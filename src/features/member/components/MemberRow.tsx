import { Link } from "react-router-dom";
import styled, { useTheme } from "styled-components";

import {
  ParMd,
  MemberCard,
  MemberCardExplorerLink,
  MemberCardCopyAddress,
  MemberCardItem,
  DropdownLink,
} from "@/lib/ui";
import type { MemberItem } from "@/lib/dao-hooks";
import type { ValidNetwork } from "@/lib/keychain-utils";
import {
  formatDateFromSeconds,
  formatValueTo,
  fromWei,
  truncateAddress,
} from "@/lib/utils";
import { useProfile } from "@/app/hooks/useProfile";
import { useAccount } from "wagmi";
import { MemberMenu } from "./MemberMenu";

const Td = styled.td`
  padding: 1.2rem 1rem;
  vertical-align: middle;

  &.hide-sm {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const AddressLink = styled(Link)`
  text-decoration: none;
  color: unset;
`;

type MemberRowProps = {
  member: MemberItem;
  daoChain: string;
  daoId: string;
  totalShares: string;
  allowLinks?: boolean;
};

function votingPowerPct(delegateShares: string, totalShares: string): string {
  if (!totalShares || totalShares === "0") return "0.00%";
  const pct =
    (Number(fromWei(delegateShares)) / Number(fromWei(totalShares))) * 100;
  return `${pct.toFixed(2)}%`;
}

export const MemberRow = ({
  member,
  daoChain,
  daoId,
  totalShares,
  allowLinks = false,
}: MemberRowProps) => {
  const theme = useTheme();
  const { address: connectedAddress } = useAccount();
  const profile = useProfile(member.memberAddress);
  const profilePath = `/molochv3/${daoChain}/${daoId}/member/${member.memberAddress}`;
  const isDelegatingToSelf =
    member.delegatingTo.toLowerCase() === member.memberAddress.toLowerCase();

  return (
    <tr>
      <Td>
        <MemberCard variant="ghost" profile={profile}>
          {allowLinks && (
            <MemberCardItem>
              <DropdownLink as={AddressLink} to={profilePath}>
                View Profile
              </DropdownLink>
            </MemberCardItem>
          )}
          <MemberCardExplorerLink
            explorerNetworkId={daoChain as ValidNetwork}
            profileAddress={member.memberAddress}
          >
            View on Etherscan
          </MemberCardExplorerLink>
          <MemberCardCopyAddress profileAddress={member.memberAddress}>
            Copy Address
          </MemberCardCopyAddress>
        </MemberCard>
      </Td>
      <Td className="hide-sm">
        <ParMd color={theme.secondary.step11}>
          {formatDateFromSeconds(member.createdAt)}
        </ParMd>
      </Td>
      <Td className="hide-sm">
        <ParMd>{votingPowerPct(member.delegateShares, totalShares)}</ParMd>
      </Td>
      <Td className="hide-sm">
        <ParMd color={theme.secondary.step11}>
          {isDelegatingToSelf ? "—" : truncateAddress(member.delegatingTo)}
        </ParMd>
      </Td>
      <Td>
        <ParMd>
          {formatValueTo({
            value: fromWei(member.shares),
            decimals: 2,
            format: "number",
          })}
        </ParMd>
      </Td>
      <Td>
        <ParMd>
          {formatValueTo({
            value: fromWei(member.loot),
            decimals: 2,
            format: "number",
          })}
        </ParMd>
      </Td>
      <Td>
        <MemberMenu
          member={member}
          daoChain={daoChain}
          daoId={daoId}
          connectedAddress={connectedAddress}
        />
      </Td>
    </tr>
  );
};
