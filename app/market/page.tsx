"use client";

import React, { useEffect, useState } from "react";
import IPAssetsList from "@/components/IPAssetsList";

interface OwnerData {
  [address: `0x${string}`]: string; // Mapping of address to contract
}

const IPAAssetsPage: React.FC = () => {
  const [ownersData, setOwnersData] = useState<OwnerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnersData = async () => {
      try {
        const response = await fetch("/api/get_existing_contracts");
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data: OwnerData = await response.json();
        setOwnersData(data);
      } catch (err) {
        console.error("Error fetching owner data:", err);
        setError("Failed to load owner data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnersData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading IP assets...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (!ownersData || Object.keys(ownersData).length === 0) {
    return <div className="text-center p-8">No IP assets found.</div>;
  }

  return (
    <div className="space-y-8 p-8">
      {Object.entries(ownersData).map(([address, contract]) => (
        <div key={address} className="bg-white shadow rounded p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Address: {address} Contract: {contract}</h2>
          <IPAssetsList address={address as `0x${string}`} />
        </div>
      ))}
    </div>
  );
};

export default IPAAssetsPage;
