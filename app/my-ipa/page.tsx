'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import IPAssetsList from '../../components/IPAssetsList';
import { useAccount } from 'wagmi';
import RegisterIpaButton from '@/components/RegisterIpaButton';

const MyIPAssets: React.FC = () => {
  const { address, isConnected } = useAccount();

  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-end">
          <ConnectButton />
        </div>
        {isConnected && address ? (
          <>
            <RegisterIpaButton />
            <h1 className="text-3xl font-bold text-center mb-8">My IP Assets</h1>
            <IPAssetsList address={address} />
          </>
        ) : (
          <p className="text-center">Please connect your wallet to view your IP assets.</p>
        )}
      </div>
    </div>
  );
};

export default MyIPAssets;
