import { toHex } from 'viem';
import { sha256 } from 'js-sha256';
import { PIL_TYPE } from '@story-protocol/react-sdk';

interface RegisterIpParams {
  title: string;
  description: string;
  watermarkImg: string;
  attributes: { key: string; value: string }[];
  nftContract: string;
  tokenId: string;
  register: any;
  wallet: any;
}

export async function registerIp(params: RegisterIpParams): Promise<{ txHash: string; ipId: string }> {
  const { title, description, watermarkImg, attributes, nftContract, tokenId, register, wallet } = params;

  if (!wallet?.account) {
    throw new Error('Кошелек не имеет учетной записи. Пожалуйста, подключите кошелек.');
  }
  // Подготовка метаданных
  const ipMetadata = {
    title,
    description,
    watermarkImg,
    attributes,
  };

  const nftMetadata = {
    name: title,
    description: description,
    image: watermarkImg,
  };

  // Загрузка метаданных на IPFS через API-эндпоинт
  const ipMetadataURI = await uploadMetadataToIPFS(ipMetadata);
  const nftMetadataURI = await uploadMetadataToIPFS(nftMetadata);

  // Вычисление SHA-256 хэша с помощью js-sha256
  const ipMetadataHash = '0x' + sha256(JSON.stringify(ipMetadata));
  const nftMetadataHash = '0x' + sha256(JSON.stringify(nftMetadata));

  console.log('Parameters for register:', {
    nftContract,
    tokenId,
    ipMetadata: {
      ipMetadataURI,
      ipMetadataHash,
      nftMetadataURI,
      nftMetadataHash,
    },
  });

  try {
    const response = await register({
      nftContract: nftContract,
      tokenId: tokenId,
      ipMetadata: {
        ipMetadataURI,
        ipMetadataHash,
        nftMetadataURI,
        nftMetadataHash,
      },
      pilType: PIL_TYPE.NON_COMMERCIAL_REMIX, // Убедитесь, что этот параметр передан, если требуется
      txOptions: { waitForTransaction: true },
    });

    console.log('Register response:', response);

    if (!response.txHash || !response.ipId) {
      throw new Error('Transaction hash или IP ID не получены.');
    }

    return {
      txHash: response.txHash,
      ipId: response.ipId,
    };
  } catch (error: any) {
    console.error('Error during registration:', error);
    if (error?.message) {
      throw new Error(`Error during registration: ${error.message}`);
    } else {
      throw new Error('Unknown error during registration.');
    }
  }
}

async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  const response = await fetch('/api/upload-to-ipfs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  const data = await response.json();
  if (response.ok) {
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  } else {
    throw new Error(data.message || 'Ошибка при загрузке на IPFS');
  }
}
