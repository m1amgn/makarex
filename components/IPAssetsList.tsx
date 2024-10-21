'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

const IPAssetsList: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [ipAssets, setIpAssets] = useState<IPAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nftContract, setNftContract] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      fetchNftContract();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const fetchNftContract = async () => {
    try {
      const response = await fetch(`/api/get_nft_contract_by_address?address=${address}`);
      const data = await response.json();
      if (data.nftContract) {
        setNftContract(data.nftContract);
        fetchIPAssets(data.nftContract);
      } else {
        setError('No NFT collection found for your address.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error fetching nftContract:', error);
      setError('Error fetching NFT contract. Please try again.');
      setLoading(false);
    }
  };

  const fetchIPAssets = async (nftContractAddress: string) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY as string,
          'X-CHAIN': process.env.NEXT_PUBLIC_X_CHAIN as string,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          options: { tokenContractIds: [nftContractAddress] },
        }),
        cache: 'no-store' as RequestCache,
      };

      const response = await fetch('https://api.storyprotocol.net/api/v1/assets', options);
      if (!response.ok) {
        throw new Error('Error fetching data from server');
      }

      const data = await response.json();

      const assetsWithImages = await Promise.all(
        data.data.map(async (asset: IPAsset) => {
          try {
            const metadataResponse = await fetch(asset.nftMetadata.tokenUri);
            if (metadataResponse.ok) {
              const metadata = await metadataResponse.json();
              asset.nftMetadata.imageUrl = metadata.image;
              asset.nftMetadata.name = metadata.name;
            }
          } catch (err) {
            console.error(`Error fetching metadata for token ${asset.nftMetadata.tokenId}:`, err);
          }
          return asset;
        })
      );

      setIpAssets(assetsWithImages);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching IP assets:', error);
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

  if (!isConnected || !address) {
    return (
      <div className="text-center p-8">
        <p>Please connect your wallet to view your IP assets.</p>
      </div>
    );
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
          onClick={() => router.push(`/my-ip-assets/${asset.id}`)}
        >
          <Image
            src={asset.nftMetadata.imageUrl}
            alt={asset.nftMetadata.name}
            className="w-full h-48 object-cover rounded mb-4"
            width={200}
            height={200}
          />
          <h2 className="text-xl font-bold mb-2">{asset.nftMetadata.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default IPAssetsList;
