import { network } from "hardhat";
import fs from "node:fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();

const abi = JSON.parse(
  fs.readFileSync("abi/MedLedger.json", "utf-8")
);

const contractAddress =
  "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48";

const equipmentId = "EQ-00042";

const result = await publicClient.readContract({
  address: contractAddress,
  abi,
  functionName: "getCertificate",
  args: [equipmentId],
});

console.log("Contract:", contractAddress);
console.log("Equipment:", equipmentId);
console.log("Stored hash:", result[0]);
console.log("Registered at:", result[1]);
console.log("Exists:", result[2]);npx hardhat run scripts/test-verify.ts --network mstTestnet
