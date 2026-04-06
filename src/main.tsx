import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RouterProvider } from 'react-router-dom';

import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from '@/lib/wagmi-config';
import { DaoHooksProvider } from '@/lib/dao-hooks';
import { HausThemeProvider } from '@/lib/ui/theme';
import { router } from './router';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <DaoHooksProvider keyConfig={{ graphKey: import.meta.env.VITE_GRAPH_API_KEY as string }}>
            <HausThemeProvider>
              <RouterProvider router={router} />
            </HausThemeProvider>
          </DaoHooksProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
