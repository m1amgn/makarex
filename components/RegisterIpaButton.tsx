'use client';

import React from 'react';
import Link from 'next/link';

const RegisterIpaButton = () => {
  return (
    <Link
      href={`register-ipa/`}
      className="inline-block mr-4 mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition duration-300"
    >
      Register New IPA
    </Link>
  );
};

export default RegisterIpaButton;
