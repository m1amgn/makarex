'use client';

import Web3Providers from '../../components/Web3Providers';
import { PropsWithChildren } from 'react';

export default function CreateIpAssetLayout({ children }: PropsWithChildren) {
  return <Web3Providers>{children}</Web3Providers>;
}