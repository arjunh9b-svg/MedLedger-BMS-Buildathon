import { network } from "hardhat";
import fs from "node:fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const [walletClient] = await viem.getWalletClients();

const abi = JSON.parse(
  fs.readFileSync("abi/MedLedger.json", "utf-8")
);

const contractAddress =
  "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48";

const equipmentId = "EQ-00042";

const originalHash =
  "0x1111111111111111111111111111111111111111111111111111111111111111";

const modifiedHash =
  "0x2222222222222222222222222222222222222222222222222222222222222222";

console.log("Testing MedLedger on MST...");
console.log("Equipment:", equipmentId);
console.log("Contract:", contractAddress);
console.log("Wallet:", walletClient.account.address);

// Register
const registerHash = await walletClient.writeContract({
  address: contractAddress,
  abi,
  functionName: "registerCertificate",
  args: [equipmentId, originalHash],
});

await publicClient.waitForTransactionReceipt({
  hash: registerHash,
});

console.log("✅ Certificate registered");
console.log("Register TX:", registerHash);

// Read
const certificate = await publicClient.readContract({
  address: contractAddress,
  abi,
  functionName: "getCertificate",
  args: [equipmentId],
});

console.log("Stored hash:", certificate[0]);
console.log("Exists:", certificate[2]);

// Verify original
const matchSimulation = await publicClient.simulateContract({
  address: contractAddress,
  abi,
  functionName: "verifyCertificate",
  args: [equipmentId, originalHash],
  account: walletClient.account,
});

console.log("Original certificate result:", matchSimulation.result);

const verifyMatchHash = await walletClient.writeContract(
  matchSimulation.request
);

await publicClient.waitForTransactionReceipt({
  hash: verifyMatchHash,
});

console.log("✅ Original certificate verification confirmed");

// Verify modified
const modifiedSimulation = await publicClient.simulateContract({
  address: contractAddress,
  abi,
  functionName: "verifyCertificate",
  args: [equipmentId, modifiedHash],
  account: walletClient.account,
});

console.log("Modified certificate result:", modifiedSimulation.result);

const verifyModifiedHash = await walletClient.writeContract(
  modifiedSimulation.request
);

await publicClient.waitForTransactionReceipt({
  hash: verifyModifiedHash,
});

console.log("✅ Modified certificate verification confirmed");

console.log("\n========== MEDLEDGER TEST COMPLETE ==========");