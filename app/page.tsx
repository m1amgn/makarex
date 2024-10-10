'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import { useIpAsset, useNftClient, PIL_TYPE } from '@story-protocol/react-sdk';
import { Address, toHex } from 'viem';
import { createHash } from 'crypto';


const HomePage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: wallet } = useWalletClient();
  const { mintAndRegisterIpAssetWithPilTerms } = useIpAsset();
  // const { createNFTCollection } = useNftClient();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    watermarkImg: string;
    attributes: string;
  }>({
    title: '',
    description: '',
    watermarkImg: '',
    attributes: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const uploadJSONToIPFS = async (metadata: any): Promise<string> => {
    const response = await fetch('/api/upload-to-ipfs', {
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
      throw new Error(data.message || 'Ошибка при загрузке на IPFS');
    }
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      setErrorMessage('Пожалуйста, подключите кошелек.');
      return;
    } else {
      console.log('Адрес кошелька:', address);
    }

    if (!wallet) {
      setErrorMessage('Ошибка: кошелек не найден. Попробуйте снова.');
      return;
    } else {
      console.log('Адрес кошелька:', address);
    }

    try {
      // const attributesArray = formData.attributes
      //   .split(',')
      //   .map((attr) => {
      //     const [key, value] = attr.split(':');
      //     return { key: key.trim(), value: value.trim() };
      //   })
      //   .filter((attr) => attr.key && attr.value);

      const ipMetadata = {
        title: formData.title,
        description: formData.description,
        watermarkImg: formData.watermarkImg,
        attributes: formData.attributes,
      };

      const nftMetadata = {
        name: formData.title,
        description: formData.description,
        image: 'https://picsum.photos/200',
      }

      const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
      const ipHash = `0x${createHash('sha256')
        .update(JSON.stringify(ipMetadata))
        .digest('hex')}`;
    
      const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
      const nftHash = `0x${createHash('sha256')
        .update(JSON.stringify(nftMetadata))
        .digest('hex')}`;

      console.log('Parameters for register:', {
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
          ipMetadataHash: ipHash as `0x${string}`,
          nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
          nftMetadataHash: nftHash as `0x${string}`,
        },
      });

      const response = await mintAndRegisterIpAssetWithPilTerms({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
          ipMetadataHash: ipHash as `0x${string}`,
          nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
          nftMetadataHash: nftHash as `0x${string}`,
        },
        txOptions: { waitForTransaction: true }
      });

      console.log('Response:', response);

      alert(`
        Success. 
        TX ${response.txHash},
        NFT Token ID: ${response.tokenId},
        IPA ID: ${response.ipId},
        License Terms ID: ${response.licenseTermsId}
      `);
    } catch (error: any) {
      console.error('Error in registration IPA:', error);
      setErrorMessage(`Error in registration IPA: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <div className="flex justify-end mb-4">
          <ConnectButton />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Регистрация IP Asset</h1>
        {errorMessage && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL изображения водяного знака</label>
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
              Атрибуты (формат: key1:value1,key2:value2)
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
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
