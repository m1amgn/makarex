'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const MyIPAAssets: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [ipaAssets, setIpaAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchIPAAssets();
    }
  }, [isConnected, address]);

  const fetchIPAAssets = async () => {
    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY as string,
          'X-CHAIN': process.env.NEXT_PUBLIC_X_CHAIN as string,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ options: { tokenContractIds: [process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS] } }),
      };

      const response = await fetch('https://edge.stg.storyprotocol.net/api/v1/assets', options);
      if (!response.ok) {
        throw new Error('Error fetching data from server');
      }

      const data = await response.json();
      setIpaAssets(data.data);
      setLoading(false);
    } catch (error: any) {
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">My IP Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ipaAssets.map((asset) => (
          <div key={asset.id} className="bg-white shadow rounded p-4">
            <img src={asset.nftMetadata.imageUrl} alt={asset.nftMetadata.name} className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-xl font-bold mb-2">{asset.nftMetadata.name}</h2>
            <p className="text-gray-700 mb-2">Token ID: {asset.nftMetadata.tokenId}</p>
            <p className="text-gray-700 mb-2">Contract: {asset.nftMetadata.tokenContract}</p>
            <a href={asset.nftMetadata.tokenUri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              More about the token
            </a>
            <a href={`https://explorer.story.foundation/ipa/${asset.id}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline block mt-2">
              View on Story Explorer
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyIPAAssets;