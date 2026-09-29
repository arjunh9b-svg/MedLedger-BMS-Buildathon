import { network } from "hardhat";
import fs from "node:fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClient = await viem.getWalletClient();

const abi = JSON.parse(
  fs.readFileSync("abi/MedLedger.json", "utf-8")
);

const contractAddress =
  "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48";

const contract = {
  address: contractAddress,
  abi,
} as const;

const command = process.env.MEDLEDGER_COMMAND;
const equipmentId = process.env.MEDLEDGER_EQUIPMENT_ID;
const certificateHash = process.env.MEDLEDGER_HASH;

if (!command || !equipmentId) {
  console.error("Missing blockchain command or equipment ID");
  process.exit(1);
}

if (command === "get") {
  const result = await publicClient.readContract({
    ...contract,
    functionName: "getCertificate",
    args: [equipmentId],
  });

  console.log(JSON.stringify({
    success: true,
    equipmentId,
    storedHash: result[0],
    registeredAt: result[1].toString(),
    exists: result[2],
  }));

} else if (command === "verify") {
  if (!certificateHash) {
    console.error("Missing certificate hash");
    process.exit(1);
  }

  const result = await publicClient.readContract({
    ...contract,
    functionName: "getCertificate",
    args: [equipmentId],
  });

  const storedHash = result[0];
  const exists = result[2];

  console.log(JSON.stringify({
    success: true,
    equipmentId,
    storedHash,
    submittedHash: certificateHash,
    exists,
    matched:
      exists &&
      storedHash.toLowerCase() === certificateHash.toLowerCase(),
  }));

} else if (command === "register") {
  if (!certificateHash) {
    console.error("Missing certificate hash");
    process.exit(1);
  }

  const accounts = await walletClient.getAddresses();

  if (accounts.length === 0) {
    console.error("No MST wallet account available");
    process.exit(1);
  }

  const account = accounts[0];

  const hash = await walletClient.writeContract({
    ...contract,
    functionName: "registerCertificate",
    args: [
      equipmentId,
      certificateHash as `0x${string}`,
    ],
    account,
  });

  console.log(JSON.stringify({
    success: true,
    equipmentId,
    transactionHash: hash,
    account,
  }));

} else {
  console.error("Unknown command:", command);
  process.exit(1);
}