import { ReactNode } from "react";
import styled from "styled-components";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  OuterLayout,
  MainLayout,
  NavMenu,
  NavMenuList,
  NavMenuLink,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuContent,
  NavMenuViewport,
  Footer,
  widthQuery,
  DropdownMenu,
  DropdownButtonTrigger,
  DropdownContent,
  DropdownItem,
} from "@/lib/ui";
import { ChevronDown } from "lucide-react";

export type NavLink = { label: string; href: string };

type AppLayoutProps = {
  children: ReactNode;
  leftNav?: ReactNode;
  navLinks?: NavLink[];
  dropdownLinks?: NavLink[];
  dropdownTriggerLabel?: string;
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.6rem 3rem;
  width: 100%;
  @media ${widthQuery.sm} {
    padding: 2rem;
  }
`;

const NavBar = styled.nav`
  background-color: ${({ theme }) => theme.secondary.step2};
  padding: 0 2.8rem;
  display: flex;
  align-items: center;
  gap: 3rem;
  min-height: 4.4rem;
  @media ${widthQuery.sm} {
    display: none;
  }
`;

const MobileNavRow = styled.div`
  display: none;
  @media ${widthQuery.sm} {
    display: flex;
    padding: 0 2rem 1.2rem;
  }
`;

const StyledNavMenuList = styled(NavMenuList)`
  gap: 0;
`;

const NavLinkItem = styled(RouterLink)<{ $active?: boolean }>`
  display: block;
  padding: 1.2rem 1.4rem;
  text-decoration: none;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.reg};
  color: ${({ theme, $active }) =>
    $active ? theme.primary.step11 : theme.navigationMenu.baseItem.color};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.primary.step11 : "transparent")};
  border-radius: 0;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    color: ${({ theme }) => theme.navigationMenu.baseItem.hover.bg};
  }
`;

const NavTriggerItem = styled(NavMenuTrigger)`
  padding: 1.2rem 1.4rem;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.reg};
`;

const DropdownList = styled.ul`
  padding: 0.8rem;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const AppLayout = ({
  children,
  leftNav,
  navLinks = [],
  dropdownLinks,
  dropdownTriggerLabel = "More",
}: AppLayoutProps) => {
  const location = useLocation();
  const allLinks = [...navLinks, ...(dropdownLinks ?? [])];

  return (
    <OuterLayout>
      <Header>
        <div>{leftNav}</div>
        <ConnectButton
          accountStatus="address"
          showBalance={false}
          chainStatus="icon"
        />
      </Header>

      {allLinks.length > 0 && (
        <MobileNavRow>
          <DropdownMenu>
            <DropdownButtonTrigger>Menu</DropdownButtonTrigger>
            <DropdownContent align="start">
              {allLinks.map((link) => (
                <DropdownItem key={link.href} asChild>
                  <RouterLink to={link.href}>{link.label}</RouterLink>
                </DropdownItem>
              ))}
            </DropdownContent>
          </DropdownMenu>
        </MobileNavRow>
      )}

      {navLinks.length > 0 && (
        <NavBar>
          <NavMenu>
            <StyledNavMenuList>
              {navLinks.map((link) => {
                const active = location.pathname === link.href;
                return (
                  <NavMenuItem key={link.href}>
                    <NavMenuLink asChild active={active}>
                      <NavLinkItem to={link.href} $active={active}>
                        {link.label}
                      </NavLinkItem>
                    </NavMenuLink>
                  </NavMenuItem>
                );
              })}
              {dropdownLinks && dropdownLinks.length > 0 && (
                <NavMenuItem>
                  <NavTriggerItem>
                    {dropdownTriggerLabel}
                    <ChevronDown
                      size="1.4rem"
                      style={{ marginLeft: "0.4rem" }}
                    />
                  </NavTriggerItem>
                  <NavMenuContent>
                    <DropdownList>
                      {dropdownLinks.map((link) => {
                        const active = location.pathname === link.href;
                        return (
                          <li key={link.href}>
                            <NavMenuLink asChild active={active}>
                              <NavLinkItem to={link.href} $active={active}>
                                {link.label}
                              </NavLinkItem>
                            </NavMenuLink>
                          </li>
                        );
                      })}
                    </DropdownList>
                  </NavMenuContent>
                </NavMenuItem>
              )}
            </StyledNavMenuList>
            <NavMenuViewport />
          </NavMenu>
        </NavBar>
      )}

      <MainLayout>{children}</MainLayout>
      <Footer />
    </OuterLayout>
  );
};
