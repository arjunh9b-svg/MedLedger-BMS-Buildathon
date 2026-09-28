import { network } from "hardhat";
import fs from "node:fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();

const [walletClient] = await viem.getWalletClients();

const abi = JSON.parse(fs.readFileSync("abi/MedLedger.json", "utf-8"));

const contractAddress = "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48";

const equipmentId = "EQ-00042";

const modifiedHash =
  "0x2222222222222222222222222222222222222222222222222222222222222222";

const result = await publicClient.simulateContract({
  address: contractAddress,
  abi,
  functionName: "verifyCertificate",
  args: [equipmentId, modifiedHash],
  account: walletClient.account,
});

console.log("Equipment:", equipmentId);
console.log("Modified certificate verification:", result.result);
