'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


interface AddCommercialLicenseButtonProps {
  assetId: string;
}

const AddCommercialLicenseButton: React.FC<AddCommercialLicenseButtonProps> = ({ assetId }) => {
  const router = useRouter();

  return (
    <button
      className="bg-indigo-600 text-white font-semibold mt-4 px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
      onClick={() => router.push(`${assetId}/add-commercial-license/`)}
    >
      Add Commercial License
    </button>
  );
};

export default AddCommercialLicenseButton;
