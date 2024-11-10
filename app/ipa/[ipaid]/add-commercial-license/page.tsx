"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWalletClient } from "wagmi";
import { LicenseTerms } from "@story-protocol/core-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { setupStoryClient } from "@/utils/resources/storyClient";
import { checksumAddress } from "viem";
import { getIPAOwner } from "@/utils/get-data/getIPAOwner";
import { currencyTokensAddress } from "@/utils/resources/currencyTokenAddress";
import BackToIPAButton from "@/components/buttons/BackToIPAButton";


interface PageProps {
    params: {
        ipaid: `0x${string}`;
    };
}

const AddCommercialLicensePage: React.FC<PageProps> = ({ params }) => {
    const router = useRouter();
    const { ipaid } = params;
    const { address, isConnected } = useAccount();
    const { data: wallet } = useWalletClient();
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<LicenseTerms>({
        defaultMintingFee: BigInt(0),
        currency: "0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5",
        royaltyPolicy: "0x28b4F70ffE5ba7A26aEF979226f77Eb57fb9Fdb6",
        transferable: true,
        expiration: BigInt(0),
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: "0x0000000000000000000000000000000000000000",
        commercializerCheckerData: "0x" as `0x${string}`,
        commercialRevShare: Number(0),
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: BigInt(0),
        uri: "",
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

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            let updatedValue = value;

            if (name === "currency") {
                updatedValue = currencyTokensAddress[value as keyof typeof currencyTokensAddress];
                console.log(updatedValue);
            } else if (name === "commercializerChecker" || name === "commercializerCheckerData") {
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
                commercialRevShare: formData.commercialRevShare,
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
            router.push(`/ipa/${ipaid}`);
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
                <BackToIPAButton ipaid={ipaid} />
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
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="commercialUse"
                                    name="commercialUse"
                                    checked={formData.commercialUse}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                    title="You can make money from using the original IP Asset, subject to limitations below."
                                    disabled
                                />
                                <label
                                    htmlFor="commercialUse"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                    title="You can make money from using the original IP Asset, subject to limitations below."
                                >
                                    Commercial Use
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="transferable"
                                    name="transferable"
                                    checked={formData.transferable}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                    title="If not, the License Token cannot be transferred once it is minted to a recipient address."
                                />
                                <label
                                    htmlFor="transferable"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                    title="If not, the License Token cannot be transferred once it is minted to a recipient address."
                                >
                                    Transferable
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
                                    title="If true, people must give credit to the original work in their commercial application (eg. merch)"
                                />
                                <label
                                    htmlFor="commercialAttribution"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                    title="If true, people must give credit to the original work in their commercial application (eg. merch)"
                                >
                                    Commercial Attribution
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="derivativesAllowed"
                                    name="derivativesAllowed"
                                    checked={formData.derivativesAllowed}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                    title="Indicates whether the licensee can create derivatives of his work or not."
                                />
                                <label
                                    htmlFor="derivativesAllowed"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                    title="Indicates whether the licensee can create derivatives of his work or not."
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
                                    title="If yes, derivatives that are made must give credit to the original work."
                                />
                                <label
                                    htmlFor="derivativesAttribution"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                    title="If yes, derivatives that are made must give credit to the original work."
                                >
                                    Derivatives Attribution
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
                                    title="If true, derivatives of this derivative can be created indefinitely as long as they have the exact same terms."
                                />
                                <label
                                    htmlFor="derivativesReciprocal"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                    title="If true, derivatives of this derivative can be created indefinitely as long as they have the exact same terms."

                                >
                                    Derivatives Reciprocal
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
                                    title="If true, the licensor must approve derivatives of the work."
                                />
                                <label
                                    htmlFor="derivativesApproval"
                                    className="ml-3 text-sm font-medium text-gray-700"
                                    title="If true, the licensor must approve derivatives of the work."
                                >
                                    Derivatives Approval
                                </label>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    title="The ERC20 token to be used to pay the minting fee.">
                                    Currency
                                </label>
                                <select
                                    name="currency"
                                    title="The ERC20 token to be used to pay the minting fee."
                                    value={
                                        Object.keys(currencyTokensAddress).find(
                                            key => currencyTokensAddress[key as keyof typeof currencyTokensAddress] === formData.currency
                                        ) || "SUSD" // Default to "SUSD"
                                    }
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {Object.keys(currencyTokensAddress).map((token) => (
                                        <option key={token} value={token}>
                                            {token}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    title="The fee to be paid when minting a license."
                                >
                                    Minting Fee (in currency)
                                </label>
                                <input
                                    type="number"
                                    name="defaultMintingFee"
                                    value={formData.defaultMintingFee.toString()}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    title="The fee to be paid when minting a license."
                                />
                            </div>
                            {/* <div>
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
                            </div> */}
                            {/* <div>
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
                            </div> */}

                            {/* <div>
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
                            </div> */}
                            {/* <div>
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
                            </div> */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    title="Amount of revenue (from any source, original & derivative) that must be shared with the licensor."
                                >
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
                                    title="Amount of revenue (from any source, original & derivative) that must be shared with the licensor."
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    title="This value determines the maximum revenue which licensee can earn from your original work. Leave 0 if not limited."
                                >
                                    Commercial Revenue Ceiling (in currency)
                                </label>
                                <input
                                    type="number"
                                    name="commercialRevCeiling"
                                    value={formData.commercialRevCeiling.toString()}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    title="This value determines the maximum revenue which licensee can earn from your original work. Leave 0 if not limited."
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    title="This value determines the maximum revenue which can be earned from derivative works. Leave 0 if not limited."
                                >
                                    Derivative Revenue Ceiling (in currency)
                                </label>
                                <input
                                    type="number"
                                    name="derivativeRevCeiling"
                                    value={formData.derivativeRevCeiling.toString()}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    title="This value determines the maximum revenue which can be earned from derivative works. Leave 0 if not limited."
                                />
                            </div>
                            {/* <div>
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
                            </div> */}
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
