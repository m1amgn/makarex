'use client';

import React from 'react';
import Link from 'next/link';

interface AddCommercialLicenseButtonProps {
  assetId: string;
}

const AddCommercialLicenseButton: React.FC<AddCommercialLicenseButtonProps> = ({ assetId }) => {
  return (
    <Link
      href={`/add-commercial-license/${assetId}`}
      className="inline-block mr-4 mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition duration-300"
    >
      Add Commercial License
    </Link>
  );
};

export default AddCommercialLicenseButton;
