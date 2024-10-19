'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import { useIpAsset, PIL_TYPE, useNftClient } from '@story-protocol/react-sdk';
import { createHash } from 'crypto';
import Nav from '../../components/Nav';

const CreateIpaPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: wallet } = useWalletClient();
  const { mintAndRegisterIpAssetWithPilTerms } = useIpAsset();
  const { createNFTCollection } = useNftClient();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    imageFile: File | null;
    watermarkImg: string;
    attributes: string;
  }>({
    title: '',
    description: '',
    imageFile: null,
    watermarkImg: '',
    attributes: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nftContract, setNftContract] = useState<string | null | undefined>(null);
  const [needsCollection, setNeedsCollection] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<{ name: string; symbol: string }>({
    name: '',
    symbol: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNftContract = async () => {
      if (isConnected && address) {
        try {
          const response = await fetch(`/api/get_nft_contract_by_address?address=${address}`);
          const data = await response.json();
          if (data.nftContract) {
            setNftContract(data.nftContract);
          } else {
            setNeedsCollection(true);
          }
        } catch (error) {
          console.error('Error fetching nftContract:', error);
          setErrorMessage('Error fetching nftContract. Please try again.');
        }
      }
    };

    fetchNftContract();
  }, [isConnected, address]);

  const uploadJSONToIPFS = async (metadata: any): Promise<string> => {
    const response = await fetch('/api/upload_to_ipfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    const data = await response.json();
    if (response.ok) {
      return data.IpfsHash;
    } else {
      throw new Error(data.message || 'Error uploading to IPFS');
    }
  };

  // Новая функция для загрузки файла на IPFS
  const uploadFileToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload_to_ipfs', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      return data.IpfsHash;
    } else {
      throw new Error(data.message || 'Error uploading file to IPFS');
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'imageFile') {
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

  const updateNftOwners = async (address: string, nftContract: string) => {
    try {
      const response = await fetch('/api/get_nft_contract_by_address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, nftContract }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update NFT owners.');
      }
    } catch (error: any) {
      console.error('Error updating NFT owners:', error);
      setErrorMessage(`Error updating NFT owners: ${error.message}`);
    }
  };

  const handleCollectionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!wallet) {
      setErrorMessage('Error: wallet not found. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const newCollection = await createNFTCollection({
        name: collectionData.name,
        symbol: collectionData.symbol,
        txOptions: { waitForTransaction: true },
      });

      setNftContract(newCollection.nftContract);
      setNeedsCollection(false);

      await updateNftOwners(address!, newCollection.nftContract as `0x${string}`);

      alert('NFT Collection created successfully!');
    } catch (error: any) {
      console.error('Error creating NFT collection:', error);
      setErrorMessage(`Error creating NFT collection: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isConnected || !address) {
      setErrorMessage('Please connect your wallet.');
      setLoading(false);
      return;
    }

    if (!wallet) {
      setErrorMessage('Error: wallet not found. Please try again.');
      setLoading(false);
      return;
    }

    try {
      if (!formData.imageFile) {
        setErrorMessage('Please select an image file.');
        setLoading(false);
        return;
      }

      // Загружаем изображение на IPFS
      const imageIpfsHash = await uploadFileToIPFS(formData.imageFile);

      const ipMetadata = {
        title: formData.title,
        description: formData.description,
        watermarkImg: formData.watermarkImg,
        attributes: formData.attributes,
      };

      const nftMetadata = {
        name: formData.title,
        description: formData.description,
        image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
      };

      const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);

      const ipHash = `0x${createHash('sha256')
        .update(JSON.stringify(ipMetadata))
        .digest('hex')}`;

      const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);

      const nftHash = `0x${createHash('sha256')
        .update(JSON.stringify(nftMetadata))
        .digest('hex')}`;

      const response = await mintAndRegisterIpAssetWithPilTerms({
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

      console.log('Response:', response);

      alert(`IPA: https://explorer.story.foundation/ipa/${response.ipId}`);
    } catch (error: any) {
      console.error('Error in registration IPA:', error);
      setErrorMessage(`Error in registration IPA: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className="flex justify-end mb-4">
        <ConnectButton />
      </div>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md w-full bg-white p-8 rounded shadow mx-auto">
          {errorMessage && (
            <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
              {errorMessage}
            </div>
          )}
          {!isConnected || !address ? (
            <p className="text-center">Please connect your wallet to proceed.</p>
          ) : loading ? (
            <p className="text-center">Processing...</p>
          ) : needsCollection ? (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">Create NFT Collection</h1>
              <form onSubmit={handleCollectionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    name="name"
                    value={collectionData.name}
                    onChange={handleCollectionChange}
                    required
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Symbol</label>
                  <input
                    name="symbol"
                    value={collectionData.symbol}
                    onChange={handleCollectionChange}
                    required
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create Collection
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">Register IP Asset</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {/* Новое поле для загрузки изображения */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL Watermark Image
                  </label>
                  <input
                    name="watermarkImg"
                    value={formData.watermarkImg}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attributes (format: key1:value1,key2:value2)
                  </label>
                  <input
                    name="attributes"
                    value={formData.attributes}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateIpaPage;
