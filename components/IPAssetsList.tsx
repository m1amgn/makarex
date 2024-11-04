"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Abi } from "viem";
import { readContracts } from "@/utils/readContracts";
import { spgTokenContractAbi } from "@/abi/spgTokenContract";
import {
  IPAssetRegistryContractAddress,
  IPAssetRegistryContractABI,
} from "@/abi/IPAssetRegistry";
import {
  coreMetadataViewModuleABI,
  coreMetadataViewModuleAddress,
} from "@/abi/coreMetadataViewModule";

interface IPAsset {
  id: string;
  name: string;
  imageUrl: string;
}

interface IPAssetsListProps {
  address: `0x${string}`;
}

const IPAssetsList: React.FC<IPAssetsListProps> = ({ address }) => {
  const [ipAssets, setIpAssets] = useState<IPAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (address) fetchNFTContract();
  }, [address]);

  const fetchNFTContract = async () => {
    try {
      const data = await fetchContract(address);
      if (data?.nftContract) {
        await fetchIPAssets(data.nftContract);
      } else {
        handleError("No NFT collection found.");
      }
    } catch (error) {
      handleError("Error fetching NFT contract. Please try again.", error);
    }
  };

  const fetchContract = async (address: string) => {
    const response = await fetch(
      `/api/get_nft_contract_by_address?address=${address}`
    );
    if (!response.ok) throw new Error("Failed to fetch NFT contract data");
    return await response.json();
  };

  const fetchIPAssets = async (nftContractAddress: string) => {
    try {
      const tokensQuantityBigInt = await getTokensQuantity(
        nftContractAddress,
        address
      );
      const tokensQuantity = Number(tokensQuantityBigInt);

      if (!tokensQuantity) {
        throw new Error("Invalid tokens quantity on your contract.");
      }

      const assets = await Promise.all(
        Array.from({ length: tokensQuantity }, (_, i) =>
          fetchIPAssetData(nftContractAddress, i + 1)
        )
      );

      setIpAssets(assets.filter((asset): asset is IPAsset => asset !== null));
      setLoading(false);
    } catch (error) {
      handleError("Error fetching IP assets", error);
    }
  };

  const getTokensQuantity = async (
    nftContractAddress: string,
    address: `0x${string}`
  ): Promise<BigInt> => {
    const quantity = await readContracts(
      nftContractAddress as `0x${string}`,
      spgTokenContractAbi as Abi,
      "balanceOf",
      [address]
    );
    return quantity as BigInt;
  };

  const fetchIPAssetData = async (
    nftContractAddress: string,
    index: number
  ): Promise<IPAsset | null> => {
    try {
      const id = await fetchIPAssetId(nftContractAddress, index);  
      const { name, imageUrl } = await fetchMetadata(id as `0x${string}`);
  
      return { id, name, imageUrl };
    } catch (error) {
      console.error(`Error fetching data for index ${index}:`, error);
      return null;
    }
  };

  const fetchIPAssetId = async (
    nftContractAddress: string,
    index: number
  ): Promise<string> => {
    return (await readContracts(
      IPAssetRegistryContractAddress as `0x${string}`,
      IPAssetRegistryContractABI as Abi,
      "ipId",
      [process.env.NEXT_PUBLIC_X_CHAIN, nftContractAddress, index]
    )) as string;
  };

  const fetchMetadata = async (
    id: `0x${string}`
  ): Promise<{ name: string; imageUrl: string }> => {
    const coreMetadata = await readContracts(
      coreMetadataViewModuleAddress as `0x${string}`,
      coreMetadataViewModuleABI as Abi,
      "getCoreMetadata",
      [id]
    );

    const tokenUri = coreMetadata.nftTokenURI;
    if (!tokenUri) throw new Error("Missing token URI");

    const metadataResponse = await fetch(tokenUri);
    if (!metadataResponse.ok) {
      throw new Error(`Failed to fetch token URI metadata for ${tokenUri}`);
    }

    const metadata = await metadataResponse.json();
    if (!metadata.name || !metadata.image) throw new Error("Metadata missing 'name' or 'image' field");

    return { name: metadata.name, imageUrl: metadata.image };
  };

  const handleError = (message: string, error?: unknown) => {
    if (error instanceof Error) {
      setError(`${message}: ${error.message}`);
    } else {
      console.error(message);
      setError(`${message}: Unknown error`);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center p-8">Loading your IP assets...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (ipAssets.length === 0) {
    return <div className="text-center p-8">No IP assets found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {ipAssets.map((asset) => (
        <div
          key={asset.id}
          className="bg-white shadow rounded p-4 cursor-pointer"
          onClick={() => router.push(`/my-ipa/${asset.id}`)}
        >
          <div className="relative w-full h-48 md:h-64 lg:h-80">
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              fill
              className="object-contain object-center rounded mb-4"
              sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
            />
          </div>
          <h2 className="text-xl font-bold mb-2">{asset.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default IPAssetsList;
