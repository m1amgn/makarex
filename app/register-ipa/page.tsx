"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from "wagmi";
import { createHash } from "crypto";
import { StoryClient, StoryConfig, PIL_TYPE } from "@story-protocol/core-sdk";
import { custom } from "viem";

const CreateIpaPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: wallet } = useWalletClient();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    imageFile: File | null;
    attributes: Array<{ key: string; value: string }>;
    commercialLicense: boolean;
    licenseType: "COMMERCIAL_USE" | "COMMERCIAL_REMIX" | null;
    revenueShare: string;
    mintFee: string;
    currency: string;
  }>({
    title: "",
    description: "",
    imageFile: null,
    attributes: [{ key: "", value: "" }],
    commercialLicense: false,
    licenseType: null,
    revenueShare: "",
    mintFee: "",
    currency: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nftContract, setNftContract] = useState<string | null | undefined>(null);
  const [needsCollection, setNeedsCollection] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<{
    name: string;
    symbol: string;
  }>({
    name: "",
    symbol: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Инициализация клиента StoryClient
  function setupStoryClient(): StoryClient | null {
    if (!wallet) return null;

    const config: StoryConfig = {
      wallet: wallet,
      transport: custom(wallet.transport),
      chainId: "iliad", // Используем ваш кастомный `iliad` чейн
    };
    const client = StoryClient.newClient(config);
    return client;
  }

  // Загрузка контракта NFT по адресу пользователя
  useEffect(() => {
    const fetchNftContract = async () => {
      if (isConnected && address) {
        try {
          const response = await fetch(
            `/api/get_nft_contract_by_address?address=${address}`
          );
          const data = await response.json();
          if (data.nftContract) {
            setNftContract(data.nftContract);
          } else {
            setNeedsCollection(true);
          }
        } catch (error) {
          console.error("Error fetching nftContract:", error);
          setErrorMessage("Error fetching nftContract. Please try again.");
        }
      }
    };

    fetchNftContract();
  }, [isConnected, address]);

  // Функции загрузки файлов и JSON на IPFS
  const uploadJSONToIPFS = async (metadata: any): Promise<string> => {
    const response = await fetch("/api/upload_to_ipfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    const data = await response.json();
    if (response.ok) {
      return data.IpfsHash;
    } else {
      throw new Error(data.message || "Error uploading to IPFS");
    }
  };

  const uploadFileToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload_to_ipfs", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      return data.IpfsHash;
    } else {
      throw new Error(data.message || "Error uploading file to IPFS");
    }
  };

  // Обработчики изменений формы
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "imageFile") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prev) => ({ ...prev, imageFile: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCollectionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollectionData((prev) => ({ ...prev, [name]: value }));
  };

  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: "", value: "" }],
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleAttributeChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setFormData((prev) => {
      const updatedAttributes = prev.attributes.map((attr, i) => {
        if (i === index) {
          return { ...attr, [field]: value };
        }
        return attr;
      });
      return { ...prev, attributes: updatedAttributes };
    });
  };

  // Обновление информации о владельцах NFT
  const updateNftOwners = async (address: string, nftContract: string) => {
    try {
      const response = await fetch("/api/get_nft_contract_by_address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, nftContract }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update NFT owners.");
      }
    } catch (error: any) {
      console.error("Error updating NFT owners:", error);
      setErrorMessage(`Error updating NFT owners: ${error.message}`);
    }
  };

  // Обработка создания новой коллекции NFT
  const handleCollectionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!wallet) {
      setErrorMessage("Error: wallet not found. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const client = setupStoryClient();
      if (!client) {
        setErrorMessage("Error initializing StoryClient.");
        setLoading(false);
        return;
      }

      const newCollection = await client.nftClient.createNFTCollection({
        name: collectionData.name,
        symbol: collectionData.symbol,
        txOptions: { waitForTransaction: true },
      });

      setNftContract(newCollection.nftContract);
      setNeedsCollection(false);

      await updateNftOwners(
        address!,
        newCollection.nftContract as `0x${string}`
      );

      alert("NFT Collection created successfully!");
    } catch (error: any) {
      console.error("Error creating NFT collection:", error);
      setErrorMessage(`Error creating NFT collection: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Обработка отправки формы регистрации IP-актива
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

    const client = setupStoryClient();
    if (!client) {
      setErrorMessage("Error initializing StoryClient.");
      setLoading(false);
      return;
    }

    try {
      if (!formData.imageFile) {
        setErrorMessage("Please select an image file.");
        setLoading(false);
        return;
      }

      const imageIpfsHash = await uploadFileToIPFS(formData.imageFile);

      const formattedAttributes = formData.attributes.map((attr) => ({
        key: attr.key,
        value: attr.value,
      }));

      const ipMetadata = {
        title: formData.title,
        description: formData.description,
        attributes: formattedAttributes,
      };

      const nftMetadata = {
        name: formData.title,
        description: formData.description,
        image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
      };

      const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);

      const ipHash = `0x${createHash("sha256")
        .update(JSON.stringify(ipMetadata))
        .digest("hex")}`;

      const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);

      const nftHash = `0x${createHash("sha256")
        .update(JSON.stringify(nftMetadata))
        .digest("hex")}`;

      let response;

      // Логика обработки типов лицензий
      if (
        formData.commercialLicense &&
        formData.licenseType === "COMMERCIAL_USE"
      ) {
        const mintFee = parseInt(formData.mintFee, 10);

        if (isNaN(mintFee)) {
          setErrorMessage(
            "Mint Fee и Revenue Share должны быть валидными числами."
          );
          setLoading(false);
          return;
        }

        if (!formData.currency) {
          setErrorMessage("Пожалуйста, введите адрес токена валюты.");
          setLoading(false);
          return;
        }

        response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
          nftContract: nftContract as `0x${string}`,
          pilType: PIL_TYPE.COMMERCIAL_USE,
          mintingFee: mintFee,
          currency: formData.currency as `0x${string}`,
          ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: ipHash as `0x${string}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: nftHash as `0x${string}`,
          },
          txOptions: { waitForTransaction: true },
        });
      } else if (
        formData.commercialLicense &&
        formData.licenseType === "COMMERCIAL_REMIX"
      ) {
        const revenueShare = parseInt(formData.revenueShare, 10);
        const mintFee = parseInt(formData.mintFee, 10);

        if (isNaN(revenueShare)) {
          setErrorMessage("Revenue Share должен быть валидным числом.");
          setLoading(false);
          return;
        }

        if (!formData.currency) {
          setErrorMessage("Пожалуйста, введите адрес токена валюты.");
          setLoading(false);
          return;
        }

        response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
          nftContract: nftContract as `0x${string}`,
          pilType: PIL_TYPE.COMMERCIAL_REMIX,
          commercialRevShare: revenueShare,
          mintingFee: mintFee,
          currency: formData.currency as `0x${string}`,
          ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: ipHash as `0x${string}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: nftHash as `0x${string}`,
          },
          txOptions: { waitForTransaction: true },
        });
      } else {
        response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
          nftContract: nftContract as `0x${string}`,
          pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
          ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: ipHash as `0x${string}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: nftHash as `0x${string}`,
          },
          txOptions: { waitForTransaction: true },
        });
      }

      console.log("Response:", response);

      alert(`IPA: https://explorer.story.foundation/ipa/${response.ipId}`);
    } catch (error: any) {
      console.error("Error in registration IPA:", error);
      setErrorMessage(`Error in registration IPA: ${error.message}`);
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
        ) : needsCollection ? (
          <>
            <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
              Create NFT Collection
            </h1>
            <p className="text-center text-gray-500">Let's build your own NFT collection within which you can create and register your NFT assets.</p>
            <form onSubmit={handleCollectionSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  value={collectionData.name}
                  onChange={handleCollectionChange}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symbol
                </label>
                <input
                  name="symbol"
                  value={collectionData.symbol}
                  onChange={handleCollectionChange}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300"
              >
                Create Collection
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
              Register IP Asset
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attributes
                </label>
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      placeholder="Key"
                      value={attr.key}
                      onChange={(e) =>
                        handleAttributeChange(index, "key", e.target.value)
                      }
                      required
                      className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={attr.value}
                      onChange={(e) =>
                        handleAttributeChange(index, "value", e.target.value)
                      }
                      required
                      className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {formData.attributes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAttribute}
                  className="text-grey-400 text-sm font-medium hover:text-indigo-600"
                >
                  + Add Attributes
                </button>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="commercialLicense"
                  name="commercialLicense"
                  checked={formData.commercialLicense}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="commercialLicense"
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  Commercial License
                </label>
              </div>
              {formData.commercialLicense && (
                <div className="mt-4">
                  <p className="text-sm text-red-700 mb-6">
                    Select the standard license terms or uncheck Commercial License and create custom terms after registering your asset. <strong>You can create custom terms on your asset's My IPA page.</strong>
                  </p>
                  <div className="flex space-x-4">
                    <label
                      className="flex items-center"
                      title="Retain control over reuse of your work, while allowing anyone to appropriately use the work in exchange for the economic terms you set."
                    >
                      <input
                        type="radio"
                        name="licenseType"
                        value="COMMERCIAL_USE"
                        checked={formData.licenseType === "COMMERCIAL_USE"}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            licenseType: "COMMERCIAL_USE",
                          }))
                        }
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Commercial use
                      </span>
                    </label>
                    <label
                      className="ml-2 flex items-center"
                      title="This license allows for endless free remixing while tracking all uses of your work while giving you full credit, with each derivative paying a percentage of revenue to its 'parent' IP."
                    >
                      <input
                        type="radio"
                        name="licenseType"
                        value="COMMERCIAL_REMIX"
                        checked={formData.licenseType === "COMMERCIAL_REMIX"}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            licenseType: "COMMERCIAL_REMIX",
                          }))
                        }
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Commercial remix
                      </span>
                    </label>
                  </div>
                  {formData.licenseType === "COMMERCIAL_REMIX" && (
                    <div className="mt-2">
                      <input
                        type="number"
                        name="revenueShare"
                        placeholder="% Revenue"
                        value={formData.revenueShare}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}
                  {formData.licenseType && (
                    <div>
                      <input
                        type="number"
                        name="mintFee"
                        placeholder="Fee for mint"
                        value={formData.mintFee}
                        onChange={handleChange}
                        required
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}
                  {formData.licenseType && (
                    <div>
                      <input
                        type="text"
                        name="currency"
                        placeholder="Currency (Token Address)"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        title="Enter a valid token contract address starting with 0x followed by 40 hexadecimal characters."
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-5">
                  Upload Image (.png, .jpeg, .jpg, .webp)
                </label>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="mt-2 w-full"
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

export default CreateIpaPage;