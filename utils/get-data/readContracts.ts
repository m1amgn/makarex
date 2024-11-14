import { odyssey } from "@story-protocol/core-sdk";
import { Abi, createPublicClient, http } from "viem";
import { publicClient } from "@/utils/resources/publicClient"


export const readContracts = async (
    address: `0x${string}`,
    abi: Abi,
    functionName: string,
    args: any
  ): Promise<any> => {
    return await publicClient.readContract({
      address: address,
      abi: abi,
      functionName: functionName,
      args: args,
    });
  };


