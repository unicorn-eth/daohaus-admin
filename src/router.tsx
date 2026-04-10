import { createBrowserRouter } from 'react-router-dom';
import { HomeContainer } from '@/layout/HomeContainer';
import { DaoContainer } from '@/layout/DaoContainer';
import { Home } from '@/pages/Home';
import { Summon } from '@/pages/Summon';
import { DaoOverview } from '@/pages/DaoOverview';
import { Proposals } from '@/pages/Proposals';
import { Proposal } from '@/pages/Proposal';
import { Members } from '@/pages/Members';
import { Member } from '@/pages/Member';
import { Safes } from '@/pages/Safes';
import { Settings } from '@/pages/Settings';
import { UpdateSettings } from '@/pages/UpdateSettings';
import { NewProposal } from '@/pages/NewProposal';
import { RageQuit } from '@/pages/RageQuit';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeContainer />,
    children: [
      { index: true, element: <Home /> },
      { path: 'summon', element: <Summon /> },
    ],
  },
  {
    path: '/molochv3/:daochain/:daoid',
    element: <DaoContainer />,
    children: [
      { index: true, element: <DaoOverview /> },
      { path: 'proposals', element: <Proposals /> },
      { path: 'proposal/:proposalId', element: <Proposal /> },
      { path: 'members', element: <Members /> },
      { path: 'member/:memberAddress', element: <Member /> },
      { path: 'safes', element: <Safes /> },
      { path: 'settings', element: <Settings /> },
      { path: 'settings/update', element: <UpdateSettings /> },
      { path: 'new-proposal', element: <NewProposal /> },
      { path: 'ragequit', element: <RageQuit /> },
    ],
  },
]);
