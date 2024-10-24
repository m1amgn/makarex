import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

interface PageProps {
    params: {
        id: string;
    };
}

interface IPAssetDetails {
    id: string;
    nftMetadata: {
        name: string;
        imageUrl: string;
        tokenUri: string;
        tokenId: string;
        tokenContract: string;
    };
}

interface AssetMetadata {
    id: string;
    metadataHash: string;
    metadataUri: string;
    metadataJson: {
        title: string;
        description: string;
        attributes: Array<{
            key: string;
            value: string;
        }>;
    };
    nftMetadataHash: string;
    nftTokenUri: string;
    registrationDate: string;
}

interface TokenUriMetadata {
    image: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = params;
    return {
        title: `Asset Details - ${id}`,
    };
}

const AssetDetailsPage = async ({ params }: PageProps) => {
    const { id } = params;

    const fetchAssetData = async (): Promise<IPAssetDetails | null> => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'X-API-Key': process.env.X_API_KEY as string,
                    'X-CHAIN': process.env.X_CHAIN as string,
                }
            };

            const response = await fetch(`https://api.storyprotocol.net/api/v1/assets/${id}`, options);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error fetching asset data: ${response.status} ${response.statusText}`, errorText);
                throw new Error('Error fetching asset data');
            }

            const data = await response.json();
            const assetData = data.data;

            if (assetData && assetData.id) {
                return assetData;
            }
            return null;
        } catch (error) {
            console.error('Error fetching asset data:', error);
            return null;
        }
    };

    const fetchAssetMetadata = async (): Promise<AssetMetadata | null> => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'X-API-Key': process.env.X_API_KEY as string,
                    'X-CHAIN': process.env.X_CHAIN as string,
                }
            };

            const response = await fetch(`https://api.storyprotocol.net/api/v1/assets/${id}/metadata`, options);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error fetching asset metadata: ${response.status} ${response.statusText}`, errorText);
                throw new Error('Error fetching asset metadata');
            }

            const data = await response.json();

            if (data && data.id) {
                return data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching asset metadata:', error);
            return null;
        }
    };

    const [assetData, assetMetadata] = await Promise.all([fetchAssetData(), fetchAssetMetadata()]);

    if (!assetData) {
        return notFound();
    }

    const fetchTokenUriMetadata = async (tokenUri: string): Promise<TokenUriMetadata | null> => {
        try {
            const response = await fetch(tokenUri);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error fetching token URI metadata: ${response.status} ${response.statusText}`, errorText);
                throw new Error('Error fetching token URI metadata');
            }

            const metadata = await response.json();
            if (metadata && metadata.image) {
                return {
                    image: metadata.image,
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching token URI metadata:', error);
            return null;
        }
    };

    const tokenUriMetadata = assetData.nftMetadata.tokenUri ? await fetchTokenUriMetadata(assetData.nftMetadata.tokenUri) : null;

    if (tokenUriMetadata) {
        assetData.nftMetadata.imageUrl = tokenUriMetadata.image;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="bg-white shadow rounded p-8">
                <h1 className="text-3xl font-bold mb-6">Asset Details</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative w-full h-48 md:h-64 lg:h-80">
                        <Image
                            src={assetData.nftMetadata.imageUrl}
                            alt={assetData.nftMetadata.name}
                            fill
                            className="object-contain object-left rounded mb-4"
                            sizes="(max-width: 768px) 100vw,
                                   (max-width: 1200px) 50vw,
                                   33vw"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{assetData.nftMetadata.name}</h2>
                        <p className="text-gray-700 mb-2">Token ID: {assetData.nftMetadata.tokenId}</p>
                        <p className="text-gray-700 mb-2">Contract: {assetData.nftMetadata.tokenContract}</p>
                        <a
                            href={`https://explorer.story.foundation/ipa/${assetData.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline block mt-2"
                        >
                            View on Story Explorer
                        </a>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">Additional Metadata</h3>
                        {assetMetadata ? (
                            <div>
                                <p className="mb-2">
                                    <strong>ID:</strong> {assetMetadata.id}
                                </p>
                                <p className="mb-2">
                                    <strong>Metadata Hash:</strong> {assetMetadata.metadataHash}
                                </p>
                                <p className="mb-2">
                                    <strong>Metadata URI:</strong>{' '}
                                    <a
                                        href={assetMetadata.metadataUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        {assetMetadata.metadataUri}
                                    </a>
                                </p>
                                <h4 className="text-lg font-bold mt-4 mb-2">Metadata JSON:</h4>
                                <ul className="list-disc list-inside">
                                    <li>
                                        <strong>Title:</strong> {assetMetadata.metadataJson.title}
                                    </li>
                                    <li>
                                        <strong>Description:</strong> {assetMetadata.metadataJson.description}
                                    </li>
                                    <li>
                                        <strong>Attributes:</strong>
                                        {assetMetadata.metadataJson.attributes && assetMetadata.metadataJson.attributes.length > 0 ? (
                                            <ul className="list-disc list-inside ml-4">
                                                {assetMetadata.metadataJson.attributes.map((attr, index) => (
                                                    <li key={index}>
                                                        <strong>{attr.key}:</strong> {attr.value}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No attributes available.</p>
                                        )}
                                    </li>
                                </ul>
                                <p className="mb-2 mt-4">
                                    <strong>NFT Metadata Hash:</strong> {assetMetadata.nftMetadataHash}
                                </p>
                                <p className="mb-2">
                                    <strong>NFT Token URI:</strong>{' '}
                                    <a
                                        href={assetMetadata.nftTokenUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        {assetMetadata.nftTokenUri}
                                    </a>
                                </p>
                                <p className="mb-2">
                                    <strong>Registration Date:</strong> {assetMetadata.registrationDate || 'N/A'}
                                </p>
                            </div>
                        ) : (
                            <p>No additional metadata available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetailsPage;
