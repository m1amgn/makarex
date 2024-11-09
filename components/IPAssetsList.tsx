"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Abi } from "viem";
import { readContracts } from "@/utils/get-data/readContracts";
import { spgTokenContractAbi } from "@/abi/spgTokenContract";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import {
  IPAssetRegistryContractAddress,
  IPAssetRegistryContractABI,
} from "@/abi/IPAssetRegistry";
import {
  coreMetadataViewModuleABI,
  coreMetadataViewModuleAddress,
} from "@/abi/coreMetadataViewModule";
import { getNftContract } from "@/utils/api-utils/getNftContract";
import { getLicenseTermsData } from "@/utils/get-data/getLicenseTermsData";

interface IPAsset {
  id: string;
  name: string;
  imageUrl: string;
  licenseId?: number;
}

interface IPAssetsListProps {
  address: `0x${string}`;
}

const IPAssetsList: React.FC<IPAssetsListProps> = ({ address }) => {
  const [ipAssets, setIpAssets] = useState<IPAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommercialOnly, setShowCommercialOnly] = useState<boolean>(false); // Filter state
  const router = useRouter();

  useEffect(() => {
    if (address) fetchNFTContract();
  }, [address]);

  const fetchNFTContract = async () => {
    try {
      const nftContract = await getNftContract(address);
      if (nftContract) {
        await fetchIPAssets(nftContract);
      } else {
        handleError("No NFT collection found.");
      }
    } catch (error) {
      handleError("Error fetching NFT contract. Please try again.", error);
    }
  };

  const fetchIPAssets = async (nftContractAddress: string) => {
    try {
      const tokensQuantityBigInt = await getTokensQuantity(nftContractAddress, address);
      const tokensQuantity = Number(tokensQuantityBigInt);

      if (!tokensQuantity) {
        throw new Error("Invalid tokens quantity on your contract.");
      }

      const assets = await Promise.all(
        Array.from({ length: tokensQuantity }, (_, i) =>
          fetchIPAssetData(nftContractAddress, i + 1)
        )
      );

      const IPAssets = assets.filter((asset): asset is IPAsset => asset !== null);
      setIpAssets(IPAssets);
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
  
      // Fetch license details and check for commercial use
      const licenses = await getLicenseTermsData(id as `0x${string}`);
      const mainLicense = licenses[0]; // Assuming we take the first license as primary
  
      return {
        id,
        name,
        imageUrl,
        licenseId: mainLicense ? parseInt(mainLicense.id, 10) : undefined, // Parse license ID to ensure it's a number
      };
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

  const fetchMetadata = async (id: `0x${string}`): Promise<{ name: string; imageUrl: string }> => {
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

  const filteredAssets = showCommercialOnly
    ? ipAssets.filter((asset) => asset.licenseId && asset.licenseId !== 1)
    : ipAssets;

  if (loading) {
    return <div className="text-center p-8">Loading IP assets...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (ipAssets.length === 0) {
    return <div className="text-center p-8">No IP assets found.</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCommercialOnly(!showCommercialOnly)}
          className="bg-gray-600 text-white font-semibold mt-4 px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          {showCommercialOnly ? "Show All Assets" : "Show Only Commercial Licenses"}
        </button>
      </div>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={1}
          slidesPerView={2}
          className="mb-2"
        >
          {filteredAssets.map((asset) => (
            <SwiperSlide key={asset.id}>
              <div
                className="bg-white rounded p-4 mr-10 ml-10 cursor-pointer"
                onClick={() => router.push(`/ipa/${asset.id}`)}
              >
                <div className="relative w-full h-48 md:h-64 lg:h-80">
                  <Image
                    src={asset.imageUrl}
                    alt={asset.name}
                    fill
                    className="object-contain object-center rounded mb-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h2 className="text-xl text-center font-bold mb-2">
                  {asset.name}
                </h2>
                {asset.licenseId && asset.licenseId !== 1 && <p className="text-gray-600 text-center">(Commercial License)</p>}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  );
};

export default IPAssetsList;
