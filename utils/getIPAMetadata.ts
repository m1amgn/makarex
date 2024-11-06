import { coreMetadataViewModuleABI, coreMetadataViewModuleAddress } from "@/abi/coreMetadataViewModule";
import { Abi } from "viem";
import { readContracts } from "./readContracts";

export const getIPAMetadata = async (
    ipaid: `0x${string}`
  ): Promise<{
    nftTokenURI: string;
    nftMetadataHash: `0x${string}`;
    metadataURI: string;
    metadataHash: `0x${string}`;
    registrationDate: number;
    owner: `0x${string}`;
  }> => {
    const coreMetadata = await readContracts(
      coreMetadataViewModuleAddress as `0x${string}`,
      coreMetadataViewModuleABI as Abi,
      "getCoreMetadata",
      [ipaid]
    );
    return coreMetadata;
  };