'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import LicenseDetails from '@/components/LicenseDetails';
import AddCommercialLicenseButton from '@/components/buttons/AddCommercialLicenseButton';
import { checksumAddress } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getIPAMetadata } from '@/utils/get-data/getIPAMetadata';
import AssetDetails from '@/components/AssetDetails';

interface PageProps {
  params: {
    ipaid: `0x${string}`;
  };
}

interface IPAData {
  nftTokenURI: string;
  nftMetadataHash: `0x${string}`;
  metadataURI: string;
  metadataHash: `0x${string}`;
  registrationDate: number;
  owner: `0x${string}`;
}

const AssetDetailsPage: React.FC<PageProps> = ({ params }) => {
  const { ipaid } = params;
  const { address, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [IPAData, setIPAData] = useState<IPAData | null>(null);


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

        if (assetData) {
          setIPAData(assetData);
        } else {
          setError('Asset not found.');
          setIsLoading(false);
          return;
        }
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

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error || "Asset not found"}</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4 mt-4 mr-2">
        <ConnectButton />
      </div>
      <div className="container mx-auto">
        <AssetDetails IPAData={IPAData} ipaid={ipaid} />
        {isConnected && address && isOwner && (
          <div className='text-center rounded mb-4'>
            <AddCommercialLicenseButton ipaid={ipaid} />
          </div>
        )}
        <LicenseDetails ipaid={ipaid} isConnected={isConnected} isOwner={isOwner} />
      </div>
    </>
  );
};

export default AssetDetailsPage;
