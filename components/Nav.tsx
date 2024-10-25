'use client';

import Link from 'next/link';
import React from 'react';

const Nav: React.FC = () => {
    return (
        <nav className="bg-gray-600 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-center space-x-8 py-4">
                    <Link href="/" className="text-gray-200 text-lg font-medium hover:text-gray-400 transition-colors duration-200">
                        Main
                    </Link>
                    <Link href="/my-ipa" className="text-gray-200 text-lg font-medium hover:text-gray-400 transition-colors duration-200">
                        My IPA
                    </Link>
                    <Link href="/register-ipa" className="text-gray-200 text-lg font-medium hover:text-gray-400 transition-colors duration-200">
                        Register IPA
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
