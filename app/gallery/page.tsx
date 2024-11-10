import React from "react";
import IPAssetsList from "@/components/IPAssetsList";

interface OwnerData {
  [address: `0x${string}`]: string;
}

async function fetchOwnersData(): Promise<OwnerData | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/get_existing_contracts`;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchOwnersData:", error);
    return null;
  }
}

export default async function IPAAssetsPage() {
  const ownersData = await fetchOwnersData();

  if (!ownersData) {
    return <div className="text-center p-8 text-red-500">Error: Failed to fetch IP assets data.</div>;
  }

  if (Object.keys(ownersData).length === 0) {
    return <div className="text-center p-8">No IP assets found.</div>;
  }

  return (
    <div className="space-y-8 p-8">
      {Object.entries(ownersData).map(([address, contract]) => (
        <div key={address} className="bg-white shadow rounded p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Address: {address} Contract: {contract}
          </h2>
          <IPAssetsList address={address as `0x${string}`} />
        </div>
      ))}
    </div>
  );
}
