'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


interface MintLicenseTokensButtonProps {
  ipaid: string;
  licenseTermsId: string;
}

const MintLicenseTokensButton: React.FC<MintLicenseTokensButtonProps> = ({ ipaid, licenseTermsId }) => {
  const router = useRouter();

  return (
    <button
      className="bg-gray-600 text-white font-semibold mt-4 px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
      onClick={() => router.push(`/ipa/${ipaid}/mint-license-tokens/${licenseTermsId}`)}
    >
      Mint License Token
    </button>
  );
};

export default MintLicenseTokensButton;
