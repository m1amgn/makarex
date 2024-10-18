"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, useAccount, useWalletClient, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StoryProvider } from "@story-protocol/react-sdk";
import { createWalletClient, custom, type Chain } from "viem";
import { PropsWithChildren, useEffect, useState } from "react";

export const iliad = {
  id: 1513,
  name: "Story Network Testnet",
  nativeCurrency: {
    name: "Testnet IP",
    symbol: "IP",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet.storyrpc.io"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://testnet.storyscan.xyz" },
  },
  testnet: true,
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: "Artcast",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [iliad],
  ssr: true, 
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <StoryProviderWrapper>{children}</StoryProviderWrapper>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function StoryProviderWrapper({ children }: PropsWithChildren) {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [wallet, setWallet] = useState<any | null>(null);

  useEffect(() => {
    if (walletClient && address) {
      try {
        const newWallet = createWalletClient({
          account: {
            address: address,
            type: "json-rpc",
          },
          chain: iliad,
          transport: custom(walletClient.transport),
        });

        setWallet(newWallet);
      } catch (error) {
        console.error("Error creating wallet:", error);
        setWallet(null);
      }
    }
  }, [walletClient, address]);

  if (!wallet || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please connect your wallet to continue.</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <StoryProvider
      config={{
        chainId: "iliad",
        transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || "https://testnet.storyrpc.io"),
        wallet,
      }}
    >
      {children}
    </StoryProvider>
  );
}


