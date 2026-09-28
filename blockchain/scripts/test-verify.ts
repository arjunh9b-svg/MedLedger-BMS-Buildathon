import { network } from "hardhat";
import fs from "node:fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();

const [walletClient] = await viem.getWalletClients();

const abi = JSON.parse(fs.readFileSync("abi/MedLedger.json", "utf-8"));

const contractAddress = "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48";

const equipmentId = "EQ-00042";

const originalHash =
  "0x1111111111111111111111111111111111111111111111111111111111111111";

const result = await publicClient.simulateContract({
  address: contractAddress,
  abi,
  functionName: "verifyCertificate",
  args: [equipmentId, originalHash],
  account: walletClient.account,
});

console.log("Equipment:", equipmentId);
console.log("Verification result:", result.result);
