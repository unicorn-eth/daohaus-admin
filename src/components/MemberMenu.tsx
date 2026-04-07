import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownIconTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLinkStyles,
  Dialog,
  DialogTrigger,
  DialogContent,
  ParMd,
  DropdownLabel,
} from "@/lib/ui";
import type { MemberItem } from "@/lib/dao-hooks";

// Styled nav link for dropdown items that navigate
const NavItem = styled(Link)`
  ${DropdownLinkStyles}
  display: block;
  width: 100%;
`;

// Styled button-as-text for items that open a dialog
const ActionItem = styled(DropdownLabel)`
  font-size: 1.6rem;

  &:hover {
    background-color: ${(props) => props.theme.secondary.step4};
    border-color: ${(props) => props.theme.secondary.step8};
    text-decoration: none;
  }
`;

const StubContent = styled.div`
  padding: 2rem 0;
`;

type ActiveDialog = "delegate" | "transfer" | "delegateTo";

type MemberMenuProps = {
  member: MemberItem;
  daoChain: string;
  daoId: string;
  connectedAddress?: string;
};

const DIALOG_TITLES: Record<ActiveDialog, string> = {
  delegate: "Manage Delegate",
  transfer: "Transfer DAO Tokens",
  delegateTo: "Delegate To",
};

const STUB_MESSAGES: Record<ActiveDialog, string> = {
  delegate:
    "Delegate your voting power to another address. Transaction form available in Phase 5.",
  transfer:
    "Transfer DAO shares or loot tokens. Transaction form available in Phase 5.",
  delegateTo:
    "Delegate your voting power to this member. Transaction form available in Phase 5.",
};

export const MemberMenu = ({
  member,
  daoChain,
  daoId,
  connectedAddress,
}: MemberMenuProps) => {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>("delegate");

  if (!connectedAddress) return null;

  const isOwnRow =
    connectedAddress.toLowerCase() === member.memberAddress.toLowerCase();

  const ragequitPath = `/molochv3/${daoChain}/${daoId}/ragequit`;
  const guildKickPath = `/molochv3/${daoChain}/${daoId}/new-proposal?formLego=GUILDKICK&defaultValues=${encodeURIComponent(
    JSON.stringify({ memberAddress: member.memberAddress }),
  )}`;

  return (
    // Dialog wraps the whole block so DialogTrigger inside the dropdown
    // can control the same Dialog instance
    <Dialog>
      <DropdownMenu>
        <DropdownIconTrigger
          Icon={MoreHorizontal}
          color="secondary"
          variant="ghost"
        />
        <DropdownContent side="left">
          {isOwnRow ? (
            <>
              <DropdownItem asChild>
                <DialogTrigger asChild>
                  <ActionItem onClick={() => setActiveDialog("delegate")}>
                    Delegate
                  </ActionItem>
                </DialogTrigger>
              </DropdownItem>
              <DropdownItem asChild>
                <DialogTrigger asChild>
                  <ActionItem onClick={() => setActiveDialog("transfer")}>
                    Transfer
                  </ActionItem>
                </DialogTrigger>
              </DropdownItem>
              <DropdownItem asChild>
                <DropdownLabel>
                  <NavItem to={ragequitPath}>Rage Quit</NavItem>
                </DropdownLabel>
              </DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem asChild>
                <DialogTrigger asChild>
                  <ActionItem onClick={() => setActiveDialog("delegateTo")}>
                    Delegate To
                  </ActionItem>
                </DialogTrigger>
              </DropdownItem>
              <DropdownItem asChild>
                <DropdownLabel>
                  <NavItem to={guildKickPath}>Guild Kick</NavItem>
                </DropdownLabel>
              </DropdownItem>
            </>
          )}
        </DropdownContent>
      </DropdownMenu>

      <DialogContent title={DIALOG_TITLES[activeDialog]}>
        <StubContent>
          <ParMd>{STUB_MESSAGES[activeDialog]}</ParMd>
        </StubContent>
      </DialogContent>
    </Dialog>
  );
};
