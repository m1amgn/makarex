export const getNftContract = async (address: `0x${string}`): Promise<`0x${string}`> => {
    const response = await fetch(
        `/api/get_nft_contract_by_address?address=${address}`
      );
    const data = await response.json();
    return data.nftContract;
};

