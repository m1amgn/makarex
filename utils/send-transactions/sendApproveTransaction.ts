import { SUSDContractABI, SUSDContractAddress } from "@/abi/SUSDContract";
import { checksumAddress, encodeFunctionData, toHex } from "viem";
import { publicClient } from "../resources/publicClient";
import { WalletClient, Account, Chain, Abi } from "viem";
import { WIPContractABI, WIPContractAddress } from "@/abi/WIPContract";

export const sendApproveTransaction = async (
  wallet: WalletClient,
  spenderAddress: `0x${string}`,
  amount: bigint,
  currency: `0x${string}`
) => {
  if (!wallet) throw new Error("Wallet client is not connected");

  const account = wallet.account as Account;
  if (!account) throw new Error("Wallet account is not defined");

  const chain = publicClient.chain as Chain;

  let currencyContract: `0x${string}`;
  let currencyABI: Abi;

  if (checksumAddress(currency) === checksumAddress(SUSDContractAddress)) {
    currencyContract = SUSDContractAddress;
    currencyABI = SUSDContractABI;
  } else {
    currencyContract = WIPContractAddress;
    currencyABI = WIPContractABI;
  }

  const data = encodeFunctionData({
    abi: currencyABI,
    functionName: "approve",
    args: [spenderAddress, amount],
  });

  const baseTransaction = {
    account,
    to: currencyContract,
    data,
    value: BigInt("0"),
    chain,
  };

  try {
    const gasEstimate = await publicClient.estimateGas(baseTransaction);
    console.log(`Estimated Gas: ${gasEstimate}`);

    const transaction = {
      ...baseTransaction,
      gas: gasEstimate,
    };

    const txHash = await wallet.sendTransaction(transaction);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    return receipt;
  } catch (error) {
    console.error("Error sending approve transaction:", error);
    throw error;
  }
};
