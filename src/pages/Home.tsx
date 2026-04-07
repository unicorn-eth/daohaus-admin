import { useAccount } from 'wagmi';
import { HomeDashboard } from '@/components/HomeDashboard';
import { HomeNotConnected } from '@/components/HomeNotConnected';

export const Home = () => {
  const { isConnected } = useAccount();
  return isConnected ? <HomeDashboard /> : <HomeNotConnected />;
};
