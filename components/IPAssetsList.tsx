"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageLoader from "@/components/ImageLoader";
import { odyssey } from "@story-protocol/core-sdk";
import { createPublicClient, http } from "viem";
import { spgTokenContractAbi } from "@/abi/spgTokenContract";

export const baseConfig = {
  chain: odyssey,
  transport: http(),
} as const;

export const publicClient = createPublicClient(baseConfig);

interface IPAsset {
  id: string;
  nftMetadata: {
    name: string;
    imageUrl: string;
    tokenUri: string;
    tokenId: string;
    tokenContract: string;
  };
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
    if (address) {
      fetchNftContract();
    }
  }, [address]);

//  const results: string[] = [];

// function myAsyncFunction(value: number): Promise<string> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(`Результат для ${value}`);
//     }, 1000);
//   });
// }

// async function collectResults(): Promise<void> {
//   for (let i = 1; i <= n; i++) {
//     const result = await myAsyncFunction(i);
//     results.push(result);
//   }
// }
// collectResults();

  const fetchNftContract = async () => {
    try {
      const response = await fetch(
        `/api/get_nft_contract_by_address?address=${address}`
      );
      const data = await response.json();
      if (data.nftContract) {
        fetchIPAssets(data.nftContract);
      } else {
        setError("No NFT collection found for your address.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error fetching nftContract:", error);
      setError("Error fetching NFT contract. Please try again.");
      setLoading(false);
    }
  };

  const getIPAssets = async (tokensQuantity: number) => {
    try {
      const ipidArray = []
      for (let i = 1; i <= tokensQuantity; i++ ) {

      }

    //   const tokensQuantityResponse = publicClient.readContract({
    //     address: nftContractAddress as `0x${string}`,
    //     abi: spgTokenContractAbi,
    //     functionName: "balanceOf",
    //     args: [address],
    //   });
    //   tokensQuantityResponse.then((tokensQuantity) => {
    //     console.log(Number(tokensQuantity));
    //   });
    } catch (error: any) {
      console.error("Error fetching IP assets:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getNftTokensQuantity = async (nftContractAddress: string) => {
    try {
      const tokensQuantityResponse = publicClient.readContract({
        address: nftContractAddress as `0x${string}`,
        abi: spgTokenContractAbi,
        functionName: "balanceOf",
        args: [address],
      });
      tokensQuantityResponse.then((tokensQuantity) => {
        getIPAssets(Number(tokensQuantity))
        console.log(Number(tokensQuantity));
      });
    } catch (error: any) {
      console.error("Error fetching IP assets:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchIPAssets = async (nftContractAddress: string) => {
    try {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_X_API_KEY as string,
          "X-CHAIN": process.env.NEXT_PUBLIC_X_CHAIN as string,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          options: { tokenContractIds: [nftContractAddress] },
        }),
        cache: "no-store" as RequestCache,
      };

      const response = await fetch(
        "https://api.storyprotocol.net/api/v1/assets",
        options
      );
      if (!response.ok) {
        throw new Error("Error fetching data from server");
      }

      const data = await response.json();

      setIpAssets(data.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching IP assets:", error);
      setError(error.message);
      setLoading(false);
    }
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
          <ImageLoader
            tokenUri={asset.nftMetadata.tokenUri}
            altText={asset.nftMetadata.name}
          />
          <h2 className="text-xl font-bold mb-2">{asset.nftMetadata.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default IPAssetsList;
