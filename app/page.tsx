'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Nav from '../components/Nav';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import { useIpAsset, PIL_TYPE } from '@story-protocol/react-sdk';
import { createHash } from 'crypto';


const HomePage: React.FC = () => {
    return (
    <div>    
      <Nav />
    <h1>MAIN PAGE</h1>
    </div>
  );
};

export default HomePage;
