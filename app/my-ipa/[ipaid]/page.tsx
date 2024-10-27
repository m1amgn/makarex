'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { notFound } from 'next/navigation';
import ImageLoader from '@/components/ImageLoader';
import LicenseDetails from '@/components/LicenseDetails';
import AddCommercialLicenseButton from '@/components/AddCommercialLicenseButton';
import { Address } from 'viem';
import { checksumAddress } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MintLicenseTokensButton from '@/components/MintLicenseTokensButton';

interface PageProps {
  params: {
    ipaid: string;
  };
}

interface IPAssetDetails {
  id: string;
  nftMetadata: {
    name: string;
    imageUrl: string;
    tokenUri: string;
    tokenId: string;
    tokenContract: Address;
  };
}

interface AssetMetadata {
  id: string;
  metadataHash: string;
  metadataUri: string;
  metadataJson: {
    title: string;
    description: string;
    attributes: Array<{
      key: string;
      value: string;
    }>;
  };
  nftMetadataHash: string;
  nftTokenUri: string;
  registrationDate: string;
}

const AssetDetailsPage: React.FC<PageProps> = ({ params }) => {
  const { ipaid } = params;
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [assetData, setAssetData] = useState<IPAssetDetails | null>(null);
  const [assetMetadata, setAssetMetadata] = useState<AssetMetadata | null>(null);
  const [ownerAddress, setOwnerAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchABI = async (): Promise<any> => {
    try {
      const response = await fetch('/abis/YourContractAbi.json');
      if (!response.ok) {
        throw new Error('Can not download ABI');
      }
      const abi = await response.json();
      return abi;
    } catch (err: any) {
      console.error('Can not download ABI:', err);
      setError('Can not download ABI');
      return null;
    }
  };

  const fetchAssetData = async (): Promise<IPAssetDetails | null> => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY as string,
          'X-CHAIN': process.env.NEXT_PUBLIC_X_CHAIN as string,
        },
      };

      const response = await fetch(`https://api.storyprotocol.net/api/v1/assets/${ipaid}`, options);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching asset data: ${response.status} ${response.statusText}`, errorText);
        throw new Error('Error fetching asset data');
      }

      const data = await response.json();
      const assetData = data.data;

      if (assetData && assetData.id) {
        return assetData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching asset data:', error);
      return null;
    }
  };

  const fetchAssetMetadata = async (): Promise<AssetMetadata | null> => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY as string,
          'X-CHAIN': process.env.NEXT_PUBLIC_X_CHAIN as string,
        },
      };

      const response = await fetch(`https://api.storyprotocol.net/api/v1/assets/${ipaid}/metadata`, options);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching asset metadata: ${response.status} ${response.statusText}`, errorText);
        throw new Error('Error fetching asset metadata');
      }

      const data = await response.json();

      if (data && data.id) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching asset metadata:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const contractABI = await fetchABI();
      if (!contractABI) {
        setIsLoading(false);
        return;
      }

      const [assetDataResult, assetMetadataResult] = await Promise.all([fetchAssetData(), fetchAssetMetadata()]);

      if (!assetDataResult) {
        setError('Asset not found');
        setIsLoading(false);
        return;
      }

      setAssetData(assetDataResult);
      setAssetMetadata(assetMetadataResult);

      try {
        if (!publicClient) {
          throw new Error('publicClient is not initialized');
        }

        const owner = await publicClient.readContract({
          address: assetDataResult.nftMetadata.tokenContract,
          abi: contractABI,
          functionName: 'ownerOf',
          args: [BigInt(assetDataResult.nftMetadata.tokenId)],
        });

        setOwnerAddress(owner as Address);
      } catch (err) {
        console.error('Error when obtaining the owner address:', err);
        setError('Error when obtaining the owner address');
      }

      setIsLoading(false);
    };

    fetchData();
  }, [ipaid]);

  if (isLoading) {
    return <div className="text-center p-8">Loading your IP asset...</div>;
  }

  if (error || !assetData) {
    return notFound();
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <ConnectButton />
      </div>
      <div className="container mx-auto p-8">
        {isConnected && address && ownerAddress &&
          checksumAddress(address) === checksumAddress(ownerAddress) && (
            <>
            <AddCommercialLicenseButton assetId={assetData.id} />
            <MintLicenseTokensButton assetId={assetData.id} />
            </>
          )}
        <div className="bg-white shadow rounded p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">{assetData.nftMetadata.name}</h2>
              <p className="text-gray-700 mb-2">Token ID: {assetData.nftMetadata.tokenId}</p>
              <p className="text-gray-700 mb-2">Contract: {assetData.nftMetadata.tokenContract}</p>
              <a
                href={`https://explorer.story.foundation/ipa/${assetData.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline block mt-2"
              >
                View on Story Explorer
              </a>
            </div>
            {assetData.nftMetadata.tokenUri && (
              <ImageLoader tokenUri={assetData.nftMetadata.tokenUri} altText={assetData.nftMetadata.name} />
            )}
            <div className="md:col-span-2">
              {assetMetadata ? (
                <div>
                  <p className="mb-2">
                    <strong>ID:</strong> {assetMetadata.id}
                  </p>
                  <p className="mb-2">
                    <strong>Metadata Hash:</strong> {assetMetadata.metadataHash}
                  </p>
                  <p className="mb-2">
                    <strong>Metadata URI:</strong>{' '}
                    <a
                      href={assetMetadata.metadataUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {assetMetadata.metadataUri}
                    </a>
                  </p>
                  <h4 className="text-lg font-bold mt-4 mb-2">Metadata JSON:</h4>
                  <ul className="list-disc list-inside">
                    <li>
                      <strong>Title:</strong> {assetMetadata.metadataJson.title}
                    </li>
                    <li>
                      <strong>Description:</strong> {assetMetadata.metadataJson.description}
                    </li>
                    <li>
                      <strong>Attributes:</strong>
                      {assetMetadata.metadataJson.attributes && assetMetadata.metadataJson.attributes.length > 0 ? (
                        <ul className="list-disc list-inside ml-4">
                          {assetMetadata.metadataJson.attributes.map((attr, index) => (
                            <li key={index}>
                              <strong>{attr.key}:</strong> {attr.value}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No attributes available.</p>
                      )}
                    </li>
                  </ul>
                  <p className="mb-2 mt-4">
                    <strong>NFT Metadata Hash:</strong> {assetMetadata.nftMetadataHash}
                  </p>
                  <p className="mb-2">
                    <strong>NFT Token URI:</strong>{' '}
                    <a
                      href={assetMetadata.nftTokenUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {assetMetadata.nftTokenUri}
                    </a>
                  </p>
                  <p className="mb-2">
                    <strong>Registration Date:</strong> {assetMetadata.registrationDate || 'N/A'}
                  </p>
                </div>
              ) : (
                <p>No additional metadata available.</p>
              )}
            </div>
          </div>
          <LicenseDetails ipId={assetData.id} />
        </div>
      </div>
    </>

  );
};

export default AssetDetailsPage;
