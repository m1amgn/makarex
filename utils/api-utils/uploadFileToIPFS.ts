export const uploadFileToIPFS = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("/api/upload_to_ipfs", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.IpfsHash;
      } else {
        throw new Error(data.message || "Error uploading file to IPFS");
      }
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      throw new Error("Failed to upload file to IPFS");
    }
  };