'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


interface MintLicenseTokensButtonProps {
  ipId: string;
  licenseTermsId: string;
}

const MintLicenseTokensButton: React.FC<MintLicenseTokensButtonProps> = ({ ipId, licenseTermsId }) => {
  const router = useRouter();

  return (
    <button
      className="bg-indigo-600 text-white font-semibold mt-4 px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
      onClick={() => router.push(`/my-ipa/${ipId}/mint-license-tokens/${licenseTermsId}`)}
    >
      Mint License Token
    </button>
  );
};

export default MintLicenseTokensButton;
