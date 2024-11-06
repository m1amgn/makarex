import { coreMetadataViewModuleABI, coreMetadataViewModuleAddress } from "@/abi/coreMetadataViewModule";
import { Abi } from "viem";
import { readContracts } from "./readContracts";

export const getIPAOwner = async (ipaid: `0x${string}`): Promise<`0x${string}` | undefined> => {
    const owner = await readContracts(
        coreMetadataViewModuleAddress as `0x${string}`,
        coreMetadataViewModuleABI as Abi,
        "getOwner",
        [ipaid]
    );
    return owner;
};