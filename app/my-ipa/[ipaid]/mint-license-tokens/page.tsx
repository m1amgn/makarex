'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { checksumAddress } from 'viem';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { custom } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        ipaid: string;
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

interface License {
    licenseTermsId: string;
}

const MintLicenseTokensPage: React.FC<PageProps> = ({ params }) => {
    const { ipaid } = params;
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const [assetData, setAssetData] = useState<IPAssetDetails | null>(null);
    const [licenseTerms, setLicenseTerms] = useState<License[]>([]);
    const [selectedLicense, setSelectedLicense] = useState<string>('');
    const [receiverAddress, setReceiverAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const { data: wallet } = useWalletClient();


    const fetchAssetData = async (): Promise<IPAssetDetails | null> => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY as string,
                    'X-CHAIN': process.env.NEXT_PUBLIC_X_CHAIN as string,
                },
            };

            const response = await fetch(`https://api.storyprotocol.net/api/v1/assets/${ipaid}`, options);
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

    const verifyOwnership = async (contractAddress: string, tokenId: string) => {
        try {
            if (!publicClient) {
                throw new Error('publicClient is not initialized');
            }

            const contractABI = await fetchABI();
            if (!contractABI) {
                setIsLoading(false);
                return;
            }

            const formattedAddress = toHexAddress(contractAddress);

            const owner = await publicClient.readContract({
                address: formattedAddress,
                abi: contractABI,
                functionName: 'ownerOf',
                args: [BigInt(tokenId)],
            });

            setOwnerAddress(owner as string);
        } catch (err) {
            console.error('Error when obtaining the owner address:', err);
            setError('Error when obtaining the owner address');
        }
    };

    const fetchLicenses = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY as string,
                    'X-CHAIN': process.env.NEXT_PUBLIC_X_CHAIN as string,
                },
            };

            const response = await fetch(`https://api.storyprotocol.net/api/v1/licenses/ip/terms/${ipaid}`, options);
            if (!response.ok) {
                throw new Error('Error fetching licenses');
            }

            const licenseData = await response.json();

            if (licenseData.data && Array.isArray(licenseData.data)) {
                setLicenseTerms(licenseData.data);
            } else {
                throw new Error('No license data found');
            }
        } catch (error) {
            console.error('Error fetching license terms:', error);
            setError('Error fetching license terms');
        }
    };

    const fetchABI = async (): Promise<any> => {
        try {
            const response = await fetch('/abis/YourContractAbi.json');
            if (!response.ok) {
                throw new Error('Cannot download ABI');
            }
            const abi = await response.json();
            return abi;
        } catch (err: any) {
            console.error('Cannot download ABI:', err);
            setError('Cannot download ABI');
            return null;
        }
    };

    const setupStoryClient = () => {
        if (!wallet) return null;

        const config: StoryConfig = {
            wallet: wallet,
            transport: custom(wallet.transport),
            chainId: 'iliad',
        };
        const client = StoryClient.newClient(config);
        return client;
    };

    const handleMint = async () => {
        try {
            const client = setupStoryClient();
            if (!client) {
                setError('Client is not initialized');
                return;
            }

            const response = await client.license.mintLicenseTokens({
                licenseTermsId: selectedLicense,
                licensorIpId: ipaid as `0x${string}`,
                receiver: receiverAddress as `0x${string}`,
                amount,
                txOptions: { waitForTransaction: true },
            });

            alert(`License Token minted https://testnet.storyscan.xyz/tx/${response.txHash}, License IDs: ${response.licenseTokenIds}`);
        } catch (error) {
            console.error('Error during minting:', error);
            setError('Error during minting');
        }
    };

    function toHexAddress(address: string): `0x${string}` {
        if (/^0x[0-9a-fA-F]{40}$/.test(address)) {
            return address as `0x${string}`;
        }
        throw new Error('Invalid address format');
    }

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            const assetDetails = await fetchAssetData();

            if (assetDetails) {
                setAssetData(assetDetails);
                await verifyOwnership(assetDetails.nftMetadata.tokenContract, assetDetails.nftMetadata.tokenId);
            }

            await fetchLicenses();
            setIsLoading(false);
        };

        initialize();
    }, [ipaid]);

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (!isConnected || !address || !ownerAddress || toHexAddress(address) !== toHexAddress(ownerAddress)) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <div className="flex justify-end mb-4">
                <ConnectButton />
            </div>
            <div className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-lg p-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                {!isConnected || !address ? (
                    <p className="text-center text-gray-500">
                        Please connect your wallet to proceed.
                    </p>
                ) : isLoading ? (
                    <p className="text-center text-gray-500">Processing...</p>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
                            Mint License Tokens
                        </h1>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleMint();
                            }}
                            className="space-y-5"
                        >
                            {/* License Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Select License
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={selectedLicense}
                                    onChange={(e) => setSelectedLicense(e.target.value)}
                                    required
                                >
                                    <option value="">Select License</option>
                                    {licenseTerms.map((license) => (
                                        <option key={license.licenseTermsId} value={license.licenseTermsId}>
                                            License ID: {license.licenseTermsId} {license.licenseTermsId !== '1' && '(Commercial)'}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            {/* Receiver Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Receiver Address
                                </label>
                                <input
                                    type="text"
                                    name="receiver"
                                    value={receiverAddress}
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                    required
                                    pattern="^0x[a-fA-F0-9]{40}$"
                                    title="Enter a valid Ethereum address starting with 0x followed by 40 hexadecimal characters."
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                                    min="1"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300"
                            >
                                Mint Tokens
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default MintLicenseTokensPage;
