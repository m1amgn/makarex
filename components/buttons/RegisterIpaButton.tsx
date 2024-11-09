'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const RegisterIpaButton = () => {
  const router = useRouter();

  return (
    <button
      className="bg-indigo-600 text-white font-semibold mt-4 px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
      onClick={() => router.push(`/register-ipa`)}
    >
      Register New IPA
    </button>
  );
};

export default RegisterIpaButton;
