import fs from "node:fs";
import path from "node:path";
import { artifacts } from "hardhat";

const artifact = await artifacts.readArtifact("MedLedger");

const abiDir = path.join(process.cwd(), "abi");

if (!fs.existsSync(abiDir)) {
  fs.mkdirSync(abiDir, { recursive: true });
}

fs.writeFileSync(
  path.join(abiDir, "MedLedger.json"),
  JSON.stringify(artifact.abi, null, 2)
);

console.log("MedLedger ABI exported successfully!");
console.log("Location: abi/MedLedger.json");