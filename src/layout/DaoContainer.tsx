import { Outlet, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useDao } from '@/lib/dao-hooks';
import { H4 } from '@/lib/ui';
import { AppLayout, NavLink } from './AppLayout';

const DaoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const DaoAvatar = styled.img`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const DaoContainer = () => {
  const { daochain, daoid } = useParams<{ daochain: string; daoid: string }>();
  const base = `/molochv3/${daochain}/${daoid}`;

  const { dao } = useDao({ chainid: daochain, daoid });

  const navLinks: NavLink[] = [
    { label: 'Overview', href: base },
    { label: 'Proposals', href: `${base}/proposals` },
    { label: 'Members', href: `${base}/members` },
    { label: 'Safes', href: `${base}/safes` },
  ];

  const dropdownLinks: NavLink[] = [
    { label: 'Settings', href: `${base}/settings` },
    { label: 'New Proposal', href: `${base}/new-proposal` },
    { label: 'Rage Quit', href: `${base}/ragequit` },
  ];

  const leftNav = (
    <DaoTitle>
      {dao?.profile?.avatarImg && (
        <DaoAvatar src={dao.profile.avatarImg} alt={dao.name ?? 'DAO'} />
      )}
      <H4>{dao?.name ?? 'Loading…'}</H4>
    </DaoTitle>
  );

  return (
    <AppLayout
      leftNav={leftNav}
      navLinks={navLinks}
      dropdownLinks={dropdownLinks}
    >
      <Outlet />
    </AppLayout>
  );
};
