'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


interface BackToIPAButtonProps {
    ipaid: string;
}

const BackToIPAButton: React.FC<BackToIPAButtonProps> = ({ ipaid }) => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(`/ipa/${ipaid}`)}
            className="py-2 px-4 rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-300 transition duration-300"
        >
            Back
        </button>
    );
};

export default BackToIPAButton;