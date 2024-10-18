import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

const pinataJwt = process.env.PINATA_JWT;
if (!pinataJwt) {
  throw new Error('PINATA_JWT is not set');
}

const pinata = new pinataSDK({ pinataJWTKey: pinataJwt });

export async function POST(req: NextRequest) {
  try {
    const metadata = await req.json();
    const result = await pinata.pinJSONToIPFS(metadata);
    return NextResponse.json({ IpfsHash: result.IpfsHash });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { message: 'Error uploading to IPFS.' },
      { status: 500 }
    );
  }
}
