'use client';

import Link from 'next/link';
import React from 'react';

const Nav: React.FC = () => {
    return (
        <nav className="bg-white shadow p-4 mb-8">
            <div className="flex justify-center space-x-4">
                <Link href="/" className="text-indigo-600 hover:underline">
                    Main
                </Link>
                <Link href="/my-ip-assets" className="text-indigo-600 hover:underline">
                    My IP Assets
                </Link>
                <Link href="/create-ip-asset" className="text-indigo-600 hover:underline">
                    Create IP Asset
                </Link>
            </div>
        </nav>
    );
};

export default Nav;