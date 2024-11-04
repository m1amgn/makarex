import { NextRequest, NextResponse } from 'next/server';
import pinataSDK, { PinataPinOptions } from '@pinata/sdk';
import { Readable } from 'stream';

const pinataJwt = process.env.PINATA_JWT;
if (!pinataJwt) {
  throw new Error('PINATA_JWT is not set');
}

const pinata = new pinataSDK({ pinataJWTKey: pinataJwt });

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const metadata = await req.json();
      const result = await pinata.pinJSONToIPFS(metadata);
      return NextResponse.json({ IpfsHash: result.IpfsHash });
    } 
    
    else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const stream = Readable.from(buffer);

      const options: PinataPinOptions = {
        pinataMetadata: {
          name: file.name,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };

      const result = await pinata.pinFileToIPFS(stream, options);
      return NextResponse.json({ IpfsHash: result.IpfsHash });
    } 
    
    else {
      return NextResponse.json({ message: 'Unsupported content type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { message: 'Error uploading to IPFS.' },
      { status: 500 }
    );
  }
}
