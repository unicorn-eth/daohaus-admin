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
import { router } from "./router";
import { CustomRainbowAvatar } from "./lib/ui/components/atoms/RainbowAvatar";

const queryClient = new QueryClient();

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
              graphKey: import.meta.env.VITE_GRAPH_API_KEY as string,
            }}
          >
            <HausThemeProvider>
              <RouterProvider router={router} />
            </HausThemeProvider>
          </DaoHooksProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
