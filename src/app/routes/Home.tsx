import { useAccount } from 'wagmi';
import { HomeDashboard } from '@/features/home/components/HomeDashboard';
import { HomeNotConnected } from '@/features/home/components/HomeNotConnected';

export const Home = () => {
  const { isConnected } = useAccount();
  return isConnected ? <HomeDashboard /> : <HomeNotConnected />;
};
