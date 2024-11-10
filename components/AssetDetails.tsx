'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';


interface AssetDetailsProps {
  IPAData: {
    nftTokenURI: string;
    nftMetadataHash: `0x${string}`;
    metadataURI: string;
    metadataHash: `0x${string}`;
    registrationDate: number;
    owner: `0x${string}`;
  } | null;
  ipaid: `0x${string}`;
}

interface nftTokenData {
  name: string;
  description: string;
  image: string;
}

interface IPAMetadata {
  title: string;
  description: string;
  attributes: Array<{
    key: string;
    value: string;
  }>;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ IPAData, ipaid }) => {
  const [nftTokenData, setNftTokenData] = useState<nftTokenData | null>(null);
  const [IPAMetadata, setIPAMetadata] = useState<IPAMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (IPAData) {
          const tokenURIResponse = await fetch(IPAData.nftTokenURI);
          if (!tokenURIResponse.ok) {
            throw new Error(`Failed to fetch token URI metadata: ${IPAData.nftTokenURI}`);
          }
          const tokenData = await tokenURIResponse.json();

          if (!tokenData.name || !tokenData.description || !tokenData.image) {
            throw new Error('Invalid token URI metadata structure.');
          }

          setNftTokenData({
            name: tokenData.name,
            description: tokenData.description,
            image: tokenData.image,
          });

          const metadataURIResponse = await fetch(IPAData.metadataURI);
          if (!metadataURIResponse.ok) {
            throw new Error(`Failed to fetch metadata URI: ${IPAData.metadataURI}`);
          }
          const metadataData = await metadataURIResponse.json();

          if (!metadataData.title || !metadataData.description || !metadataData.attributes) {
            throw new Error('Invalid metadata URI structure.');
          }

          setIPAMetadata({
            title: metadataData.title,
            description: metadataData.description,
            attributes: metadataData.attributes,
          });
        } else {
          setError('Asset not found.');
        }
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError('Error fetching asset metadata.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [IPAData]);

  if (isLoading) {
    return <div className="text-center p-8">Loading asset details...</div>;
  }

  if (error || !nftTokenData || !IPAMetadata) {
    return <div className="text-center p-8 text-red-500">Error: {error || 'Asset not found'}</div>;
  }

  return (
    <div className="bg-white shadow rounded">
      <div className="mb-6 flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 h-48 md:h-64 lg:h-80">
          <Image
            src={nftTokenData.image.startsWith('ipfs://') ? nftTokenData.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : nftTokenData.image}
            alt={nftTokenData.name}
            fill
            className="object-contain object-left rounded mb-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">{nftTokenData.name}</h2>
          <p className="text-gray-700 mb-2">{nftTokenData.description}</p>

          <div className="mt-8">
            <p className="mb-2">
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
                href={IPAData?.nftTokenURI || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 hover:underline"
              >
                <strong>NFT Data URI</strong>
              </a>
            </p>
            <p className="mb-8">
              <a
                href={IPAData?.metadataURI || ''}
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
          </div>

          <p className="mb-2 mt-8">
            <strong>IPA Attributes:</strong>
          </p>
          {IPAMetadata.attributes.length > 0 ? (
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
    </div>
  );
};

export default AssetDetails;
