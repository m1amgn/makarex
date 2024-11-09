export const updateNftContract = async (address: `0x${string}`, nftContract: `0x${string}`): Promise<any> => {
    const response = await fetch("/api/get_nft_contract_by_address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY_SET_OWNER_NFT_CONTRACT as string,
        },
        body: JSON.stringify({ address, nftContract }),
      });
      const data = await response.json();
      return data;
};

