import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http } from "viem";

export const setupStoryClient = (wallet: any): StoryClient | null => {
    if (!wallet) return null;
  
    const config: StoryConfig = {
      wallet: wallet,
      transport: http(process.env.RPC_PROVIDER_URL),
      chainId: "odyssey",
    };
  
    return StoryClient.newClient(config);
  };