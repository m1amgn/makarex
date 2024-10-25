'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import IPAssetsList from '../../components/IPAssetsList';

const MyIPAssets: React.FC = () => {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <ConnectButton />
      </div>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">My IP Assets</h1>
        <IPAssetsList />
      </div>
    </div>
  );
};

export default MyIPAssets;
