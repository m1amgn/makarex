'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import ImageLoader from '@/components/ImageLoader';

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
      
      setIpAssets(data.data);
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
          onClick={() => router.push(`/my-ipa/${asset.id}`)}
        >
          <ImageLoader tokenUri={asset.nftMetadata.tokenUri} altText={asset.nftMetadata.name} />
          <h2 className="text-xl font-bold mb-2">{asset.nftMetadata.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default IPAssetsList;
