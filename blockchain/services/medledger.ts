import { network } from "hardhat";
import fs from "node:fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const [walletClient] = await viem.getWalletClients();

const abi = JSON.parse(fs.readFileSync("abi/MedLedger.json", "utf-8"));

const contractAddress = "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48";

export async function registerCertificate(
  equipmentId: string,
  certificateHash: `0x${string}`,
) {
  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "registerCertificate",
    args: [equipmentId, certificateHash],
  });

  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  return txHash;
}

export async function verifyCertificate(
  equipmentId: string,
  certificateHash: `0x${string}`,
) {
  const result = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "verifyCertificate",
    args: [equipmentId, certificateHash],
    account: walletClient.account,
  });

  return result.result;
}

export async function getCertificate(equipmentId: string) {
  return await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getCertificate",
    args: [equipmentId],
  });
}

export async function updateCertificate(
  equipmentId: string,
  newCertificateHash: `0x${string}`,
) {
  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "updateCertificate",
    args: [equipmentId, newCertificateHash],
  });

  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  return txHash;
}

export async function getCertificateHistory(equipmentId: string) {
  const currentBlock = await publicClient.getBlockNumber();

  const registeredLogs = await publicClient.getContractEvents({
    address: contractAddress,
    abi,
    eventName: "CertificateRegistered",
    args: {
      equipmentId,
    },
    fromBlock: 0n,
    toBlock: currentBlock,
  });

  const updatedLogs = await publicClient.getContractEvents({
    address: contractAddress,
    abi,
    eventName: "CertificateUpdated",
    args: {
      equipmentId,
    },
    fromBlock: 0n,
    toBlock: currentBlock,
  });

  const verifiedLogs = await publicClient.getContractEvents({
    address: contractAddress,
    abi,
    eventName: "CertificateVerified",
    args: {
      equipmentId,
    },
    fromBlock: 0n,
    toBlock: currentBlock,
  });

  return {
    registered: registeredLogs,
    updated: updatedLogs,
    verified: verifiedLogs,
  };
}
