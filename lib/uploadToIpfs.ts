import pinataSDK from '@pinata/sdk';
import { IpMetadata } from "@story-protocol/core-sdk"


export async function uploadJSONToIPFS(IpMetadata: IpMetadata): Promise<string> {
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })
    const { IpfsHash } = await pinata.pinJSONToIPFS(IpMetadata)
    return IpfsHash
}
