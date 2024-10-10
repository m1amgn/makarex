"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, useAccount, useWalletClient, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StoryProvider } from "@story-protocol/react-sdk";
import { createWalletClient, custom, type Chain } from "viem";
import { PropsWithChildren, useEffect, useState } from "react";

export const iliad = {
  id: 1513, // Your custom chain ID
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
  ssr: true, // If your dApp uses server side rendering (SSR)
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

// we use this component to pass in our
// wallet from wagmi
function StoryProviderWrapper({ children }: PropsWithChildren) {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [wallet, setWallet] = useState<any | null>(null);

  useEffect(() => {
    // Проверяем, что все необходимые данные присутствуют
    if (walletClient && address) {
      try {
        // Создаем совместимый экземпляр клиента кошелька
        const newWallet = createWalletClient({
          account: {
            address: address,
            type: "json-rpc", // Указываем правильный тип аккаунта
          },
          chain: iliad,
          transport: custom(walletClient.transport), // Используем транспорт из walletClient
        });

        setWallet(newWallet);
      } catch (error) {
        console.error("Ошибка при создании кошелька:", error);
        setWallet(null); // Устанавливаем wallet в null при ошибке
      }
    }
  }, [walletClient, address]);

  // Если wallet или address отсутствует, показываем кнопку подключения
  if (!wallet || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Пожалуйста, подключите ваш кошелек для продолжения работы.</p>
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


