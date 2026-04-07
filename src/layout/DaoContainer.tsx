import { Outlet, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useDao } from "@/lib/dao-hooks";
import { H4 } from "@/lib/ui";
import { AppLayout, NavLink } from "./AppLayout";

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
  const { address } = useAccount();

  const navLinks: NavLink[] = [
    { label: "Hub", href: "/" },
    { label: "DAO", href: base },
    { label: "Proposals", href: `${base}/proposals` },
    { label: "Safes", href: `${base}/safes` },
    { label: "Members", href: `${base}/members` },
    { label: "Settings", href: `${base}/settings` },
    ...(address ? [{ label: "Profile", href: `${base}/member/${address}/` }] : []),
  ];

  const leftNav = (
    <DaoTitle>
      {dao?.profile?.avatarImg && (
        <DaoAvatar src={dao.profile.avatarImg} alt={dao.name ?? "DAO"} />
      )}
      <H4>{dao?.name ?? "Loading…"}</H4>
    </DaoTitle>
  );

  return (
    <AppLayout leftNav={leftNav} navLinks={navLinks}>
      <Outlet />
    </AppLayout>
  );
};
