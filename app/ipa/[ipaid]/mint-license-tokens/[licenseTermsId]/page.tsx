'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter, useSearchParams } from 'next/navigation'
import { setupStoryClient } from "@/utils/resources/storyClient";
import { getIPAOwner } from '@/utils/get-data/getIPAOwner';
import { checksumAddress } from 'viem';
import BackToIPAButton from '@/components/buttons/BackToIPAButton';
import { sendApproveTransaction } from '@/utils/send-transactions/sendApproveTransaction';
import { royaltyModuleContractAddress } from '@/abi/royaltyModuleContract';


interface PageProps {
    params: {
        ipaid: string;
        licenseTermsId: string;
    };
}

const MintLicenseTokensPage: React.FC<PageProps> = ({ params }) => {
    const { ipaid, licenseTermsId } = params;
    const { address, isConnected } = useAccount();
    const [receiverAddress, setReceiverAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { data: wallet } = useWalletClient();
    const router = useRouter();
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const fee = BigInt(searchParams.get('fee') ?? '0');    
    const currency = searchParams.get('currency') as `0x${string}` ?? '';


    useEffect(() => {
        const checkOwner = async () => {
            setIsLoading(true);
            try {
                if (!ipaid || typeof ipaid !== 'string') {
                    setError('Invalid IP asset ID.');
                    setIsLoading(false);
                    return;
                }
                const owner = await getIPAOwner(ipaid as `0x${string}`);

                if (owner) {
                    if (address && checksumAddress(address) === checksumAddress(owner)) {
                        setIsOwner(true);
                    } else {
                        setIsOwner(false);
                    }
                } else {
                    console.error("Have not get owner address from contract.")
                }
            } catch (err) {
                console.error('Error checking owner:', err);
                setError('Error checking owner.');
            } finally {
                setIsLoading(false);
            }
        };
        checkOwner();
    }, [ipaid, address]);

    const handleMint = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!isConnected || !address) {
            setError("Please connect your wallet.");
            setIsLoading(false);
            return;
        }

        if (!wallet) {
            setError("Error: wallet not found. Please try again.");
            setIsLoading(false);
            return;
        }

        if (!ipaid) {
            setError("Invalid IP Asset ID.");
            setIsLoading(false);
            return;
        }

        const client = setupStoryClient(wallet);

        if (!client) {
            setError("Error initializing StoryClient.");
            setIsLoading(false);
            return;
        }

        try {
            setIsProcessing(true);
            const approveReceipt = await sendApproveTransaction(wallet, royaltyModuleContractAddress, fee, currency)

            if (!approveReceipt || approveReceipt.status !== 'success') {
                setError("Approve transaction failed.");
                setIsProcessing(false);
                return;
            }

            alert(`Approve transaction confirmed. Hash: ${approveReceipt.transactionHash}`);

            const response = await client.license.mintLicenseTokens({
                licenseTermsId: licenseTermsId,
                licensorIpId: ipaid as `0x${string}`,
                receiver: receiverAddress as `0x${string}`,
                amount,
                txOptions: { waitForTransaction: true },
            });

            alert(`License Token minted https://testnet.storyscan.xyz/tx/${response.txHash}, License IDs: ${response.licenseTokenIds}`);
            router.push(`/ipa/${ipaid}`);

        } catch (error) {
            console.error('Error during minting:', error);
            setError('Error during minting');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <div className="flex justify-between items-center mb-4">
                <BackToIPAButton ipaid={ipaid} />
                <ConnectButton />
            </div>

            <div className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-lg p-6">
                {!isConnected ? (
                    <div className="text-center text-gray-500">
                        Please connect your wallet to continue.
                    </div>
                ) : !isOwner ? (
                    <div className="text-center text-gray-500">
                        You are not the owner of this IP Asset. Only the owner can mint license tokens.
                    </div>
                ) : isProcessing ? (
                    <div className="text-center text-gray-500">Processing transaction...</div>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
                            Mint License Tokens
                        </h1>
                        <form
                            onSubmit={(e) => {
                                handleMint(e);
                            }}
                            className="space-y-5"
                        >
                            <div>
                                <h4 className="text-center text-gray-700">
                                    License Terms # {licenseTermsId}
                                </h4>
                            </div>
                            <div>

                                <div className="flex items-center justify-between mt-2">
                                    <label htmlFor="sendToSelf" className="block text-sm font-medium text-gray-700">
                                        Receiver Address
                                    </label>
                                    <div className="flex items-center">
                                        <label htmlFor="sendToSelf" className="text-sm text-gray-700">
                                            My address
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="sendToSelf"
                                            className="ml-2"
                                            checked={receiverAddress === address}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setReceiverAddress(address || '');
                                                } else {
                                                    setReceiverAddress('');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    name="receiver"
                                    value={receiverAddress}
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                    required
                                    disabled={receiverAddress === address}
                                    pattern="^0x[a-fA-F0-9]{40}$"
                                    title="Enter a valid Ethereum address starting with 0x followed by 40 hexadecimal characters."
                                    className={`mt-1 w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 ${receiverAddress === address ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
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
                                disabled={isProcessing}
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
