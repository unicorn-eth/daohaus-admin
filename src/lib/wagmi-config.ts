import { http } from 'wagmi';
import { mainnet, gnosis, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY as string;

export const wagmiConfig = getDefaultConfig({
  appName: 'DAOhaus Admin',
  projectId: import.meta.env.VITE_WALLET_CONNECT_ID as string,
  chains: [mainnet, gnosis, optimism, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [gnosis.id]: http(`https://gnosis-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`),
  },
});
