export const uploadJSONToIPFS = async (metadata: any): Promise<string> => {
    try {
      const response = await fetch("/api/upload_to_ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.IpfsHash;
      } else {
        throw new Error(data.message || "Error uploading JSON to IPFS");
      }
    } catch (error) {
      console.error("Error uploading JSON to IPFS:", error);
      throw new Error("Failed to upload JSON to IPFS");
    }
  };