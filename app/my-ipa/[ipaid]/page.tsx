'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAccount, usePublicClient } from 'wagmi';
import LicenseDetails from '@/components/LicenseDetails';
import AddCommercialLicenseButton from '@/components/AddCommercialLicenseButton';
import { checksumAddress } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MintLicenseTokensButton from '@/components/MintLicenseTokensButton';
import { getIPAMetadata } from '@/utils/getIPAMetadata';

interface PageProps {
  params: {
    ipaid: string;
  };
}

interface nftTokenData {
  name: string;
  description: string;
  image: string;
}

interface IPAMetadata {
  uri: string;
  title: string;
  description: string;
  attributes: Array<{
    key: string;
    value: string;
  }>;
}

const AssetDetailsPage: React.FC<PageProps> = ({ params }) => {
  const { ipaid } = params;
  const { address, isConnected } = useAccount();
  const [nftTokenData, setNftTokenData] = useState<nftTokenData | null>(null);
  const [nftTokenMetadataURI, setNftTokenMetadataURI] = useState<string | null>(null);
  const [IPAMetadataUri, setIPAMetadataUri] = useState<string | null>(null);
  const [IPAMetadata, setIPAMetadata] = useState<IPAMetadata | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (!ipaid || typeof ipaid !== 'string') {
          setError('Invalid IP asset ID.');
          setIsLoading(false);
          return;
        }

        const assetData = await getIPAMetadata(ipaid as `0x${string}`);

        if (address && checksumAddress(address) === checksumAddress(assetData.owner)) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }

        if (!assetData.nftTokenURI || !assetData.metadataURI) {
          setError('Asset not found.');
          setIsLoading(false);
          return;
        }
        setNftTokenMetadataURI(assetData.nftTokenURI);
        setIPAMetadataUri(assetData.metadataURI);

        const tokenURIResponse = await fetch(assetData.nftTokenURI);
        if (!tokenURIResponse.ok) {
          throw new Error(`Failed to fetch token URI metadata for ${assetData.nftTokenURI}`);
        }

        const tokenURIData = await tokenURIResponse.json();

        if (!tokenURIData.name || !tokenURIData.image) {
          throw new Error("Invalid token URI metadata structure.");
        }
        setNftTokenData(tokenURIData);

        const metadataURIResponse = await fetch(assetData.metadataURI);
        if (!metadataURIResponse.ok) {
          throw new Error(`Failed to fetch metadata URI for ${assetData.metadataURI}`);
        }
        const metadataURIData = await metadataURIResponse.json();


        if (!metadataURIData.title || !metadataURIData.attributes) {
          throw new Error("Invalid metadata URI structure.");
        }
        setIPAMetadata(metadataURIData);
      } catch (err) {
        console.error('Error fetching asset metadata:', err);
        setError('Error fetching asset metadata.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ipaid, address]);

  if (isLoading) {
    return <div className="text-center p-8">Loading your IP asset...</div>;
  }

  if (error || !nftTokenData || !IPAMetadata) {
    return <div className="text-center p-8 text-red-500">Error: {error || "Asset not found"}</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <ConnectButton />
      </div>
      <div className="container mx-auto p-8">
        <div className="bg-white shadow rounded p-8">
          <div className="mb-6 flex flex-col md:flex-row gap-8">
            <div className="relative w-full md:w-1/2 h-48 md:h-64 lg:h-80">
              <Image
                src={nftTokenData.image}
                alt={nftTokenData.name}
                fill
                className="object-contain object-left rounded mb-4"
                sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 50vw,
                     33vw"
              />
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">{nftTokenData.name}</h2>
              <p className="text-gray-700 mb-2">{nftTokenData.description}</p>
              <p className="mb-2 mt-8">
                <a
                  href={`https://odyssey.explorer.story.foundation/ipa/${ipaid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 hover:underline"
                >
                  <strong>IPA in Story Protocol Explorer</strong>
                </a>
              </p>
              <p className="mb-2">
                <a
                  href={nftTokenMetadataURI || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 hover:underline"
                >
                  <strong>NFT Data URI</strong>
                </a>
              </p>
              <p className="mb-8">
                <a
                  href={IPAMetadataUri || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 hover:underline"
                >
                  <strong>IPA Data URI</strong>
                </a>
              </p>

              <p className="mb-2">
                <strong>IPA Address:</strong> {ipaid}
              </p>
              {/* <p className="mb-2">
                <strong>IPA Title:</strong> {IPAMetadata.title}
              </p>
              <p className="mb-2">
                <strong>IPA Description:</strong> {IPAMetadata.description}
              </p> */}
              <p className="mb-2 mt-8">
                <strong>IPA Attributes:</strong>
              </p>
              {IPAMetadata.attributes && IPAMetadata.attributes.length > 0 ? (
                <ul className="list-disc list-inside ml-4 mb-6">
                  {IPAMetadata.attributes.map((attr, index) => (
                    <li key={index}>
                      <strong>{attr.key}:</strong> {attr.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No attributes available.</p>
              )}
              
            </div>
          </div>
          {isConnected && address && isOwner && (
            <div className='text-left rounded mb-4'>
              <AddCommercialLicenseButton assetId={ipaid} />
              <MintLicenseTokensButton assetId={ipaid} />
            </div>
          )}
          <LicenseDetails ipId={ipaid} />
        </div>
      </div>
    </>
  );
};

export default AssetDetailsPage;
