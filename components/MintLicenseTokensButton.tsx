'use client';

import React from 'react';
import Link from 'next/link';

interface MintLicenseTokensButtonProps {
  assetId: string;
}

const MintLicenseTokensButton: React.FC<MintLicenseTokensButtonProps> = ({ assetId }) => {
  return (
    <Link
      href={`${assetId}/mint-license-tokens/`}
      className="inline-block mr-4 mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition duration-300"
    >
      Mint License Tokens
    </Link>
  );
};

export default MintLicenseTokensButton;
