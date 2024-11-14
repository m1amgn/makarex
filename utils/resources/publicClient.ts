import { createPublicClient, http } from "viem";

import { odyssey } from "@story-protocol/core-sdk";

const baseConfig = {
    chain: odyssey,
    transport: http(),
  } as const;
  
export const publicClient = createPublicClient(baseConfig);