import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAddress } from 'viem';

const API_KEY = process.env.API_KEY_SET_OWNER_NFT_CONTRACT;

type Owners = { [key: string]: string };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const checksummedAddress = getAddress(address);

    const filePath = path.join(process.cwd(), 'spg_nft_owners.json');
    let owners: Owners = {};

    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      owners = JSON.parse(jsonData);
    }

    const nftContract = owners[checksummedAddress];

    return NextResponse.json({ nftContract });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {

  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { address, nftContract } = body;

  if (!address || !nftContract) {
    return NextResponse.json({ error: 'Address and nftContract are required' }, { status: 400 });
  }

  try {
    const checksummedAddress = getAddress(address);

    const filePath = path.join(process.cwd(), 'spg_nft_owners.json');
    let owners: Owners = {};

    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      owners = JSON.parse(jsonData);
    }

    owners[checksummedAddress] = nftContract;

    fs.writeFileSync(filePath, JSON.stringify(owners, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }
}
