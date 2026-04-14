import { Outlet } from 'react-router-dom';
import { H4 } from '@/lib/ui';
import { AppLayout } from './AppLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const HomeContainer = () => {
  return (
    <AppLayout
      leftNav={<H4>DAOhaus Admin</H4>}
      navLinks={[
        { label: 'Hub', href: '/' },
        { label: 'Summon', href: '/summon' },
      ]}
    >
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </AppLayout>
  );
};
