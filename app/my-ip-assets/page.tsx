'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import Nav from '../../components/Nav';
import IPAAssetsList from '../../components/IPAAssetsList';

const MyIPAAssets: React.FC = () => {
  return (
    <div>
      <Nav />
      <div className="flex justify-end mb-4">
        <ConnectButton />
      </div>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">My IP Assets</h1>
        <IPAAssetsList />
      </div>
    </div>
  );
};

export default MyIPAAssets;
