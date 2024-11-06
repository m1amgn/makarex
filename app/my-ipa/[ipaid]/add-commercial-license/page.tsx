"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWalletClient } from "wagmi";
import { LicenseTerms } from "@story-protocol/core-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { setupStoryClient } from "@/utils/storyClient";
import { checksumAddress } from "viem";
import { getIPAOwner } from "@/utils/getIPAOwner";


interface PageProps {
    params: {
        ipaid: string;
    };
}

interface formData {
    defaultMintingFee: string;
    currency: `0x${string}`;
    royaltyPolicy: `0x${string}`;
    transferable: boolean;
    expiration: string;
    commercialUse: boolean;
    commercialAttribution: boolean;
    commercializerChecker: `0x${string}`;
    commercializerCheckerData: `0x${string}`;
    commercialRevShare: string;
    commercialRevCeiling: string;
    derivativesAllowed: boolean;
    derivativesAttribution: boolean;
    derivativesApproval: boolean;
    derivativesReciprocal: boolean;
    derivativeRevCeiling: string;
    uri: string;
}

const AddCommercialLicensePage: React.FC<PageProps> = ({ params }) => {
    const router = useRouter();
    const { ipaid } = params;
    const { address, isConnected } = useAccount();
    const { data: wallet } = useWalletClient();
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<formData>({
        defaultMintingFee: "0",
        currency: "0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5",
        royaltyPolicy: "0x28b4F70ffE5ba7A26aEF979226f77Eb57fb9Fdb6",
        transferable: false,
        expiration: "0",
        commercialUse: false,
        commercialAttribution: false,
        commercializerChecker: "0x0000000000000000000000000000000000000000",
        commercializerCheckerData: "0x" as `0x${string}`,
        commercialRevShare: "0",
        commercialRevCeiling: "0",
        derivativesAllowed: false,
        derivativesAttribution: false,
        derivativesApproval: false,
        derivativesReciprocal: false,
        derivativeRevCeiling: "0",
        uri: "https://ipfs.io",
    });

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
                    console.error("Didn't get owner address from contract.")
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

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            let updatedValue = value;

            if (name === "currency" || name === "commercializerChecker" || name === "commercializerCheckerData") {
                if (!updatedValue.startsWith("0x")) {
                    updatedValue = "0x" + updatedValue;
                }
            }
            setFormData((prev) => ({ ...prev, [name]: updatedValue }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
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
            const licenseTerms: LicenseTerms = {
                defaultMintingFee: BigInt(formData.defaultMintingFee),
                currency: formData.currency,
                royaltyPolicy: formData.royaltyPolicy,
                transferable: formData.transferable,
                expiration: BigInt(formData.expiration),
                commercialUse: formData.commercialUse,
                commercialAttribution: formData.commercialAttribution,
                commercializerChecker: formData.commercializerChecker,
                commercializerCheckerData: formData.commercializerCheckerData,
                commercialRevShare: parseInt(formData.commercialRevShare, 10),
                commercialRevCeiling: BigInt(formData.commercialRevCeiling),
                derivativesAllowed: formData.derivativesAllowed,
                derivativesAttribution: formData.derivativesAttribution,
                derivativesApproval: formData.derivativesApproval,
                derivativesReciprocal: formData.derivativesReciprocal,
                derivativeRevCeiling: BigInt(formData.derivativeRevCeiling),
                uri: formData.uri,
            };

            const response = await client.ipAsset.registerPilTermsAndAttach({
                ipId: ipaid as `0x${string}`,
                terms: licenseTerms,
                txOptions: { waitForTransaction: true },
            });

            console.log("Response:", response);

            alert(`License added successfully! Transaction Hash: ${response.txHash}`);
            router.push(`/my-ipa/${ipaid}`);
        } catch (error: any) {
            console.error("Error adding license:", error);
            setError(`Error adding license: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => router.push(`/my-ipa/${ipaid}`)}
                    className="py-2 px-4 rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-300 transition duration-300"
                >
                    Back
                </button>
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
                ) : !isOwner ? (
                    <div className="text-center p-8">
                        You can not add commercial license for this IPA.
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
                            Add Commercial License
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Currency (Token Address)
                                </label>
                                <input
                                    type="text"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    required
                                    pattern="^0x[a-fA-F0-9]{40}$"
                                    title="Enter a valid token contract address starting with 0x followed by 40 hexadecimal characters."
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Default Minting Fee (in Wei)
                                </label>
                                <input
                                    type="number"
                                    name="defaultMintingFee"
                                    value={formData.defaultMintingFee}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Royalty Policy
                                </label>
                                <input
                                    type="text"
                                    name="royaltyPolicy"
                                    value={formData.royaltyPolicy}
                                    onChange={handleChange}
                                    pattern="^0x[a-fA-F0-9]{40}$"
                                    title="Enter a valid token contract address starting with 0x followed by 40 hexadecimal characters."
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="transferable"
                                    name="transferable"
                                    checked={formData.transferable}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="transferable"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                >
                                    Transferable
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Expiration (Unix Timestamp)
                                </label>
                                <input
                                    type="number"
                                    name="expiration"
                                    value={formData.expiration}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="commercialUse"
                                    name="commercialUse"
                                    checked={formData.commercialUse}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="commercialUse"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                >
                                    Commercial Use
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="commercialAttribution"
                                    name="commercialAttribution"
                                    checked={formData.commercialAttribution}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="commercialAttribution"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                >
                                    Commercial Attribution
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Commercializer Checker Address
                                </label>
                                <input
                                    type="text"
                                    name="commercializerChecker"
                                    value={formData.commercializerChecker}
                                    onChange={handleChange}
                                    required
                                    pattern="^0x[a-fA-F0-9]{40}$"
                                    title="Enter a valid contract address starting with 0x followed by 40 hexadecimal characters."
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Commercializer Checker Data (Hex String)
                                </label>
                                <input
                                    type="text"
                                    name="commercializerCheckerData"
                                    value={formData.commercializerCheckerData}
                                    onChange={handleChange}
                                    required
                                    pattern="^0x[a-fA-F0-9]*$"
                                    title="Enter a valid hex string starting with 0x."
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Commercial Revenue Share (%)
                                </label>
                                <input
                                    type="number"
                                    name="commercialRevShare"
                                    value={formData.commercialRevShare}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Commercial Revenue Ceiling (in Wei)
                                </label>
                                <input
                                    type="number"
                                    name="commercialRevCeiling"
                                    value={formData.commercialRevCeiling}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="derivativesAllowed"
                                    name="derivativesAllowed"
                                    checked={formData.derivativesAllowed}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="derivativesAllowed"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                >
                                    Derivatives Allowed
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="derivativesAttribution"
                                    name="derivativesAttribution"
                                    checked={formData.derivativesAttribution}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="derivativesAttribution"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                >
                                    Derivatives Attribution
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="derivativesApproval"
                                    name="derivativesApproval"
                                    checked={formData.derivativesApproval}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="derivativesApproval"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                >
                                    Derivatives Approval
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="derivativesReciprocal"
                                    name="derivativesReciprocal"
                                    checked={formData.derivativesReciprocal}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="derivativesReciprocal"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                >
                                    Derivatives Reciprocal
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Derivative Revenue Ceiling (in Wei)
                                </label>
                                <input
                                    type="number"
                                    name="derivativeRevCeiling"
                                    value={formData.derivativeRevCeiling}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    License URI
                                </label>
                                <input
                                    type="text"
                                    name="uri"
                                    value={formData.uri}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300"
                            >
                                Submit
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddCommercialLicensePage;
