import { createConfig, http } from 'wagmi';
import { mainnet, gnosis, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  baseAccount,
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY as string;
const projectId = import.meta.env.VITE_WALLET_CONNECT_ID as string;
const chains = [mainnet, gnosis, optimism, arbitrum, base, sepolia] as const;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        baseAccount,
        rabbyWallet,
        safeWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'DAOhaus Admin',
    projectId,
  },
);

export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [gnosis.id]: http(`https://gnosis-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`),
  },
});
