import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { RouterProvider } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";

import { wagmiConfig } from "@/lib/wagmi-config";
import { DaoHooksProvider } from "@/lib/dao-hooks";
import { HausThemeProvider } from "@/lib/ui/theme";
import { env } from "@/lib/env";
import { router } from "./router";
import { CustomRainbowAvatar } from "./lib/ui/components/atoms/RainbowAvatar";
import { EnvWarning } from "./components/EnvWarning";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,  // 2 min — DAO data, members
      gcTime: 10 * 60 * 1000,    // 10 min
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#15192d",
            borderRadius: "small",
            fontStack: "system",
          })}
          modalSize="compact"
          avatar={CustomRainbowAvatar}
        >
          <DaoHooksProvider
            keyConfig={{
              graphKey: env.graphApiKey,
            }}
          >
            <HausThemeProvider>
              <EnvWarning />
              <RouterProvider router={router} />
            </HausThemeProvider>
          </DaoHooksProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
