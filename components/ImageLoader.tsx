'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageLoaderProps {
    tokenUri: string;
    altText: string;
}

interface TokenUriMetadata {
    image: string;
    name: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ tokenUri, altText }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokenUriMetadata = async () => {
            try {
                const response = await fetch(tokenUri);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error fetching token URI metadata: ${response.status} ${response.statusText}`, errorText);
                    throw new Error('Error fetching token URI metadata');
                }

                const metadata: TokenUriMetadata = await response.json();
                if (metadata && metadata.image) {
                    setImageUrl(metadata.image);
                }
            } catch (error) {
                console.error('Error fetching token URI metadata:', error);
            }
        };

        fetchTokenUriMetadata();
    }, [tokenUri]);

    if (!imageUrl) {
        return <div>Loading image...</div>;
    }

    return (
        <div className="relative w-full h-48 md:h-64 lg:h-80">
            <Image
                src={imageUrl}
                alt={altText}
                fill
                className="object-contain object-center rounded mb-4"
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
            />
        </div>
    );
};

export default ImageLoader;
