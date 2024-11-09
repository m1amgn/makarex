import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type Owners = { [key: string]: string };

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'spg_nft_owners.json');
    let owners: Owners = {};

    // Check if the file exists and load it
    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      owners = JSON.parse(jsonData);
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(owners);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to load NFT owners' }, { status: 500 });
  }
}
