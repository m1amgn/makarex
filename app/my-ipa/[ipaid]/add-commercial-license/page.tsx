"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAccount, useWalletClient } from "wagmi";
import { StoryClient, StoryConfig, LicenseTerms } from "@story-protocol/core-sdk";
import { custom } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";


const AddCommercialLicensePage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const ipId = params.ipaid as `0x${string}` | null;

    const { address, isConnected } = useAccount();
    const { data: wallet } = useWalletClient();

    const [formData, setFormData] = useState<{
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
    }>({
        defaultMintingFee: "0",
        currency: "0x91f6F05B08c16769d3c85867548615d270C42fC7",
        royaltyPolicy: "0x793Df8d32c12B0bE9985FFF6afB8893d347B6686",
        transferable: false,
        expiration: "0",
        commercialUse: false,
        commercialAttribution: false,
        commercializerChecker: "0x0000000000000000000000000000000000000000",
        commercializerCheckerData: "0x" as `0x${string}`, commercialRevShare: "0",
        commercialRevCeiling: "0",
        derivativesAllowed: false,
        derivativesAttribution: false,
        derivativesApproval: false,
        derivativesReciprocal: false,
        derivativeRevCeiling: "0",
        uri: "",
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    function setupStoryClient(): StoryClient | null {
        if (!wallet) return null;

        const config: StoryConfig = {
            wallet: wallet,
            transport: custom(wallet.transport),
            chainId: "iliad",
        };
        const client = StoryClient.newClient(config);
        return client;
    }

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
        setLoading(true);

        if (!isConnected || !address) {
            setErrorMessage("Please connect your wallet.");
            setLoading(false);
            return;
        }

        if (!wallet) {
            setErrorMessage("Error: wallet not found. Please try again.");
            setLoading(false);
            return;
        }

        if (!ipId) {
            setErrorMessage("Invalid IP Asset ID.");
            setLoading(false);
            return;
        }

        const client = setupStoryClient();
        if (!client) {
            setErrorMessage("Error initializing StoryClient.");
            setLoading(false);
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
                ipId: ipId,
                terms: licenseTerms,
                txOptions: { waitForTransaction: true },
            });

            console.log("Response:", response);

            alert(`License added successfully! Transaction Hash: ${response.txHash}`);
            router.push(`/my-ipa/${ipId}`);
        } catch (error: any) {
            console.error("Error adding license:", error);
            setErrorMessage(`Error adding license: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <div className="flex justify-end mb-4">
                <ConnectButton />
            </div>
            <div className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-lg p-6">
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {errorMessage}
                    </div>
                )}
                {!isConnected || !address ? (
                    <p className="text-center text-gray-500">
                        Please connect your wallet to proceed.
                    </p>
                ) : loading ? (
                    <p className="text-center text-gray-500">Processing...</p>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
                            Add Commercial License
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Currency */}
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
                            {/* Default Minting Fee */}
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
                            {/* Royalty Policy */}
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
                            {/* Transferable */}
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
                            {/* Expiration */}
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
                            {/* Commercial Use */}
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
                            {/* Commercial Attribution */}
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
                            {/* Commercializer Checker */}
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
                            {/* Commercializer Checker Data */}
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

                            {/* Commercial Revenue Share */}
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
                            {/* Commercial Revenue Ceiling */}
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
                            {/* Derivatives Allowed */}
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
                            {/* Derivatives Attribution */}
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
                            {/* Derivatives Approval */}
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
                            {/* Derivatives Reciprocal */}
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
                            {/* Derivative Revenue Ceiling */}
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
                            {/* URI */}
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
                            {/* Submit Button */}
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
